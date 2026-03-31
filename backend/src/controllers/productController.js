/**
 * Product Controller
 * Handles all CRUD operations for products.
 * Each handler follows the pattern: validate → query → respond.
 */
const ProductModel = require('../models/productModel');
const pool = require('../config/db');

/**
 * GET /api/products
 * Returns paginated product list with search and filter support.
 * Query params: page, limit, search, categoryId, status, sortBy, order
 */
exports.getAll = async (req, res, next) => {
  try {
    const { page, limit, search, categoryId, status, sortBy, order } = req.query;

    const result = await ProductModel.findAll({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || '',
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      status,
      sortBy,
      order,
    });

    res.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/categories
 * Returns all categories for form dropdowns.
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await ProductModel.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Returns a single product with full details.
 */
exports.getById = async (req, res, next) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Creates a new product. Requires admin role.
 * Logs the action in the activity_log table.
 */
exports.create = async (req, res, next) => {
  try {
    const { name, sku, description, categoryId, price, quantity } = req.body;

    const product = await ProductModel.create({
      name,
      sku,
      description,
      categoryId,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      createdBy: req.user.id,
    });

    // Log the create action
    await pool.execute(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'create', 'product', product.id, JSON.stringify({ name, sku })]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: product,
    });
  } catch (error) {
    // Handle duplicate SKU
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'A product with this SKU already exists.',
      });
    }
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Updates an existing product. Requires admin role.
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, sku, description, categoryId, price, quantity } = req.body;

    // Check if product exists
    const existing = await ProductModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const updated = await ProductModel.update(id, {
      name,
      sku,
      description,
      categoryId,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    });

    // Log the update action
    await pool.execute(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'update', 'product', id, JSON.stringify({ name, sku })]
    );

    res.json({
      success: true,
      message: 'Product updated successfully.',
      data: updated,
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'A product with this SKU already exists.',
      });
    }
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Deletes a product. Requires admin role.
 */
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get product info before deletion for the log
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    await ProductModel.delete(id);

    // Log the delete action
    await pool.execute(
      'INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, 'delete', 'product', null, JSON.stringify({ name: product.name, sku: product.sku })]
    );

    res.json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
