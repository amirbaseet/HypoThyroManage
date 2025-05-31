const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authorizeRoles = require("../middlewares/roleMiddleware")
const verifyToken = require("../middlewares/authMiddleware")

// Protect with admin middleware if needed
router.post('/form-windows', verifyToken, authorizeRoles("admin"), adminController.createFormWindow);
router.get('/form-windows', verifyToken, authorizeRoles("admin"), adminController.getAllFormWindows);
router.patch('/form-windows/:id/toggle', verifyToken, authorizeRoles("admin"), adminController.toggleFormWindowStatus);

module.exports = router;
