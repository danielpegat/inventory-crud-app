/**
 * Product Model
 * Database queries for product CRUD operations.
 * Supports pagination, search, filtering, and sorting.
 */
const pool = require('../config/db');

const ProductModel = {
  /**
   * Get paginated product list with optional search, category filter, and status filter.
   * Returns both the data rows and total count for pagination metadata.
   *
   * @param {Object} options - Query parameters
   * @param {number} options.page - Current page (1-indexed)
   * @param {number} options.limit - Items per page
   * @param {string} options.search - Search term for name/SKU
   * @param {number} options.categoryId - Filter by category
   * @param {string} options.status - Filter by stock status
   * @param {string} options.sortBy - Column to sort by
   * @param {string} options.order - 'asc' or 'desc'
   */
  async findAll({ page = 1, limit = 10, search = '', categoryId, status, sortBy = 'created_at', order = 'desc' }) {
    const offset = (page - 1) * limit;

    // Build WHERE clauses dynamically based on filters
    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push('(p.name LIKE ? OR p.sku LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (categoryId) {
      whereConditions.push('p.category_id = ?');
      params.push(categoryId);
    }

    if (status) {
      whereConditions.push('p.status = ?');
      params.push(status);
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Whitelist sortable columns to prevent SQL injection
    const allowedSortColumns = ['name', 'sku', 'price', 'quantity', 'status', 'created_at', 'updated_at'];
    const safeSort = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Main query with JOIN to get category info
    const dataQuery = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
             u.name AS created_by_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.created_by = u.id
      ${whereClause}
      ORDER BY p.${safeSort} ${safeOrder}
      LIMIT ? OFFSET ?
    `;

    // Count query for pagination metadata
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM products p
      ${whereClause}
    `;

    const [rows] = await pool.execute(dataQuery, [...params, String(limit), String(offset)]);
    const [countResult] = await pool.execute(countQuery, params);

    return {
      data: rows,
      total: countResult[0].total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(countResult[0].total / limit),
    };
  },

  /**
   * Get a single product by ID with category details.
   */
  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug, c.color AS category_color,
              u.name AS created_by_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new product.
   * Automatically calculates stock status based on quantity.
   */
  async create({ name, sku, description, categoryId, price, quantity, createdBy }) {
    const status = quantity === 0 ? 'out_of_stock' : quantity <= 10 ? 'low_stock' : 'in_stock';

    const [result] = await pool.execute(
      `INSERT INTO products (name, sku, description, category_id, price, quantity, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, sku, description || null, categoryId, price, quantity, status, createdBy]
    );

    return this.findById(result.insertId);
  },

  /**
   * Update an existing product.
   * Recalculates stock status based on new quantity.
   */
  async update(id, { name, sku, description, categoryId, price, quantity }) {
    const status = quantity === 0 ? 'out_of_stock' : quantity <= 10 ? 'low_stock' : 'in_stock';

    await pool.execute(
      `UPDATE products SET name = ?, sku = ?, description = ?, category_id = ?, price = ?, quantity = ?, status = ?
       WHERE id = ?`,
      [name, sku, description || null, categoryId, price, quantity, status, id]
    );

    return this.findById(id);
  },

  /**
   * Delete a product by ID.
   * Returns true if a row was deleted, false otherwise.
   */
  async delete(id) {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Get all categories (for form dropdowns).
   */
  async getCategories() {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name ASC');
    return rows;
  },
};

module.exports = ProductModel;
