const express = require("express");
const router = express.Router();
const MedicineLog = require("../models/MedicineLog");
const User = require("../models/userModels"); // ⬅️ Make sure this path is correct
const { getCurrentWeek } = require("../utils/weekUtils");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

console.log("👉 verifyToken in this file is a", typeof verifyToken);

// ✅ POST /api/medicine/take
router.post("/take", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = today.getDate();
    const month = today.getMonth(); // 0-indexed
    const year = today.getFullYear();

    const { weekStart, weekEnd } = getCurrentWeek();

    const log = await MedicineLog.findOneAndUpdate(
      { userId, date: today },
      {
        taken: true,
        day,
        month,
        year,
        weekStart,
        weekEnd,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({ message: "Medicine marked as taken", log });
  } catch (error) {
    console.error("❌ Error taking medicine:", error);
    res.status(500).json({ message: "Error updating medicine log" });
  }
});

// ✅ GET /api/medicine/progress?days=30
router.get("/progress", verifyToken, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id; // ✅ Support patientId from doctor
    // prevent a normal user to fetch others users progress day
    if (req.query.userId && req.query.userId !== req.user.id) {
      if (req.user.role !== "doctor") {
        return res.status(403).json({ message: "Access denied" });
      }
    }
    
    const days = parseInt(req.query.days) || 60;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const createdAt = new Date(user.createdAt);
    createdAt.setHours(0, 0, 0, 0);

    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    // Restrict by createdAt
    const startDate = createdAt > since ? createdAt : since;

    const logs = await MedicineLog.find({
      userId,
      date: { $gte: startDate },
    });

    // Group logs by date string for easier lookup
    const logsByDate = {};
    logs.forEach(log => {
      const dateStr = log.date.toISOString().split("T")[0];
      logsByDate[dateStr] = log.taken;
    });

    // Get all weeks from the range
    const allWeeks = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const dayStr = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay();

      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekKey = weekStart.toISOString().split("T")[0];

      if (!allWeeks[weekKey]) {
        allWeeks[weekKey] = {
          weekStart,
          weekEnd,
          logs: [],
        };
      }

      allWeeks[weekKey].logs.push({
        date,
        taken: logsByDate[dayStr] ?? false,
      });
    }

    // Sort logs within each week
    for (const key in allWeeks) {
      allWeeks[key].logs.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    const weeks = Object.values(allWeeks).sort(
      (a, b) => new Date(b.weekStart) - new Date(a.weekStart)
    );

    res.json({ weeks });

  } catch (error) {
    console.error("❌ Error fetching weekly progress:", error);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
});

// ✅ GET /api/medicine/summary/monthly?month=2&year=2025
router.get("/summary/monthly", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const month = parseInt(req.query.month); // 0 = January
    const year = parseInt(req.query.year);

    if (isNaN(month) || isNaN(year)) {
      return res.status(400).json({ message: "Month and year are required as numbers." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const createdAt = new Date(user.createdAt);
    createdAt.setHours(0, 0, 0, 0);

    const logs = await MedicineLog.find({
      userId,
      month,
      year,
      date: { $gte: createdAt },
    }).sort({ day: 1 });

    const totalDays = logs.length;
    const takenDays = logs.filter(log => log.taken).length;
    const missedDays = totalDays - takenDays;

    const dailyStatus = logs.map(log => ({
      date: log.date.toISOString().split("T")[0],
      taken: log.taken,
    }));

    res.status(200).json({
      month,
      year,
      totalDays,
      takenDays,
      missedDays,
      adherenceRate: totalDays > 0 ? Math.round((takenDays / totalDays) * 100) : 0,
      dailyStatus,
    });

  } catch (error) {
    console.error("❌ Error fetching monthly summary:", error);
    res.status(500).json({ message: "Failed to fetch monthly summary" });
  }
});
// 🔐 Middleware: Must be doctor
router.get("/patient-progress/:patientId", verifyToken, authorizeRoles("doctor"), async (req, res) => {
    try {
      const doctorId = req.user.id;
      const patientId = req.params.patientId;
  
      const patient = await User.findById(patientId);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
  
      if (!patient.doctorId || patient.doctorId.toString() !== doctorId) {
        return res.status(403).json({ message: "Unauthorized: This patient is not assigned to you." });
      }
  
      const logs = await MedicineLog.find({ userId: patientId }).sort({ date: -1 });
  
      res.status(200).json({ patient: { id: patientId, name: patient.username }, logs });
    } catch (error) {
      console.error("❌ Error fetching patient progress:", error);
      res.status(500).json({ message: "Failed to fetch patient progress" });
    }
  });
// GET /api/doctor/patients-progress
router.get("/patients-progress", verifyToken, authorizeRoles("doctor"), async (req, res) => {
    try {
      const doctorId = req.user.id;
  
      const patients = await User.find({ doctorId }, "_id username email");
  
      const progressMap = {};
  
      for (const patient of patients) {
        const logs = await MedicineLog.find({ userId: patient._id }).sort({ date: -1 });
        const takenCount = logs.filter(l => l.taken).length;
  
        progressMap[patient._id] = {
          username: patient.username,
          email: patient.email,
          totalLogs: logs.length,
          taken: takenCount,
          missed: logs.length - takenCount,
          adherence: logs.length > 0 ? Math.round((takenCount / logs.length) * 100) : 0,
        };
      }
  
      res.status(200).json({ progress: progressMap });
    } catch (error) {
      console.error("❌ Error fetching all patients' progress:", error);
      res.status(500).json({ message: "Failed to fetch patients' progress" });
    }
  });
    
module.exports = router;
