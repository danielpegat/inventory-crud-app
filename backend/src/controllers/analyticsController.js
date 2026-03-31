/**
 * Analytics Controller
 * Provides aggregated data for the dashboard stat cards and activity feed.
 */
const pool = require('../config/db');

/**
 * GET /api/analytics/summary
 * Returns key metrics for the dashboard:
 * - Total products, total inventory value, low stock count
 * - Products created this month, category breakdown
 * - Recent activity log entries
 */
exports.getSummary = async (req, res, next) => {
  try {
    // Total product count
    const [totalResult] = await pool.execute('SELECT COUNT(*) AS total FROM products');

    // Total inventory value (sum of price * quantity)
    const [valueResult] = await pool.execute(
      'SELECT COALESCE(SUM(price * quantity), 0) AS totalValue FROM products'
    );

    // Low stock + out of stock count
    const [lowStockResult] = await pool.execute(
      "SELECT COUNT(*) AS count FROM products WHERE status IN ('low_stock', 'out_of_stock')"
    );

    // Products created this month
    const [newThisMonth] = await pool.execute(
      'SELECT COUNT(*) AS count FROM products WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())'
    );

    // Category breakdown (for potential chart data)
    const [categoryBreakdown] = await pool.execute(
      `SELECT c.name, c.color, COUNT(p.id) AS count
       FROM categories c
       LEFT JOIN products p ON c.id = p.category_id
       GROUP BY c.id, c.name, c.color
       ORDER BY count DESC`
    );

    // Recent activity log (last 10 entries)
    const [recentActivity] = await pool.execute(
      `SELECT al.*, u.name AS user_name
       FROM activity_log al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT 10`
    );

    // User count
    const [userCount] = await pool.execute('SELECT COUNT(*) AS count FROM users');

    res.json({
      success: true,
      data: {
        totalProducts: totalResult[0].total,
        totalValue: parseFloat(valueResult[0].totalValue),
        lowStockCount: lowStockResult[0].count,
        newThisMonth: newThisMonth[0].count,
        totalUsers: userCount[0].count,
        categoryBreakdown,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};
