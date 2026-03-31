/**
 * Product Routes
 * RESTful CRUD endpoints for product management.
 * All routes require authentication, write operations require admin role.
 */
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const productController = require('../controllers/productController');

// Validation rules shared by create and update
const productValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
  body('sku').trim().isLength({ min: 2 }).withMessage('SKU is required'),
  body('categoryId').isInt({ min: 1 }).withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater'),
  body('description').optional().trim(),
];

// GET /api/products/categories — Get all categories (for dropdowns)
router.get('/categories', auth, productController.getCategories);

// GET /api/products — List all products (paginated, searchable)
router.get('/', auth, productController.getAll);

// GET /api/products/:id — Get single product
router.get('/:id', auth, productController.getById);

// POST /api/products — Create product (admin only)
router.post('/', auth, roleCheck('admin'), productValidation, validate, productController.create);

// PUT /api/products/:id — Update product (admin only)
router.put('/:id', auth, roleCheck('admin'), productValidation, validate, productController.update);

// DELETE /api/products/:id — Delete product (admin only)
router.delete('/:id', auth, roleCheck('admin'), productController.remove);

module.exports = router;
