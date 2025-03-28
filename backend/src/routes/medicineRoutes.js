const express = require("express");
const router = express.Router();

const {
  takeMedicine,
  getProgress,
  getMissedMedicineUsers
} = require("../controllers/medicineController");

const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// POST /api/medicine/take
router.post("/take", verifyToken, authorizeRoles("patient"), takeMedicine);

// GET /api/medicine/progress?days=30
router.get("/progress", verifyToken, authorizeRoles("patient", "doctor"), getProgress);

router.get("/missed-medicine-users", verifyToken, authorizeRoles("doctor"), getMissedMedicineUsers);

module.exports = router;
