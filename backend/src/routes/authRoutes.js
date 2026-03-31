/**
 * Auth Routes
 * Defines authentication-related API endpoints.
 * Validation rules are applied inline using express-validator.
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

// POST /api/auth/login — Authenticate user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

// POST /api/auth/register — Create new user (public for initial setup, protect in production)
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Role must be admin or user'),
  ],
  validate,
  authController.register
);

// POST /api/auth/refresh — Refresh access token
router.post('/refresh', authController.refresh);

// GET /api/auth/me — Get current user profile (protected)
router.get('/me', auth, authController.getProfile);

module.exports = router;
