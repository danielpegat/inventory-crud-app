/**
 * Analytics Routes
 * Dashboard data aggregation endpoints.
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics/summary — Dashboard summary data
router.get('/summary', auth, analyticsController.getSummary);

module.exports = router;
