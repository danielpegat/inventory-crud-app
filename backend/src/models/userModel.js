/**
 * User Model
 * Database queries for user-related operations.
 * All methods return promises (async/await compatible).
 */
const pool = require('../config/db');

const UserModel = {
  /**
   * Find a user by their email address.
   * Used during login to verify credentials.
   */
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password_hash, role, avatar_url, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  /**
   * Find a user by their ID.
   * Used to get the current user's profile (GET /auth/me).
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Create a new user account.
   * Password must be hashed BEFORE passing to this method.
   */
  async create({ name, email, passwordHash, role = 'user' }) {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role]
    );
    return { id: result.insertId, name, email, role };
  },

  /**
   * Get all users (admin only).
   */
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },
};

module.exports = UserModel;
