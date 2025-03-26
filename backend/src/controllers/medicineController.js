const MedicineLog = require("../models/MedicineLog");
const User = require("../models/userModels");
const { getCurrentWeek } = require("../utils/weekUtils");

exports.takeMedicine = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const { weekStart, weekEnd } = getCurrentWeek();

    const log = await MedicineLog.findOneAndUpdate(
      { userId, date: today },
      { taken: true, day, month, year, weekStart, weekEnd },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Medicine marked as taken", log });
  } catch (error) {
    console.error("❌ Error taking medicine:", error);
    res.status(500).json({ message: "Error updating medicine log" });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;

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

    const startDate = createdAt > since ? createdAt : since;

    const logs = await MedicineLog.find({
      userId,
      date: { $gte: startDate },
    });

    const logsByDate = {};
    logs.forEach(log => {
      const dateStr = log.date.toISOString().split("T")[0];
      logsByDate[dateStr] = log.taken;
    });

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
};
