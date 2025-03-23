const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Protect with admin middleware if needed
router.post('/form-windows', adminController.createFormWindow);
router.get('/form-windows', adminController.getAllFormWindows);
router.patch('/form-windows/:id/toggle', adminController.toggleFormWindowStatus);

module.exports = router;
