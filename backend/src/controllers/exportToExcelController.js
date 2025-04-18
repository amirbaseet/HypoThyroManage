const ExcelJS = require('exceljs');
const MedicineLog = require('../models/MedicineLog');
const User = require('../models/userModels');
const WeeklyReport = require('../models/weeklyReport');
const Symptom = require("../models/Symptom");


exports.exportAllMedicineLogs = async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" }).select("_id username phoneNumber createdAt");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Weekly Patient Progress');

    // Header for weekly breakdown
    sheet.columns = [
      { header: 'Patient Name', key: 'username', width: 20 },
      { header: 'Phone Number', key: 'phoneNumber', width: 20 },
      { header: 'Week Start', key: 'weekStart', width: 15 },
      { header: 'Week End', key: 'weekEnd', width: 15 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Taken', key: 'taken', width: 10 },
    ];

    for (const patient of patients) {
      const createdAt = new Date(patient.createdAt);
      createdAt.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalDays = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24));

      const logs = await MedicineLog.find({
        userId: patient._id,
        date: { $gte: createdAt }
      });

      const logsByDate = {};
      logs.forEach(log => {
        const dateStr = log.date.toISOString().split("T")[0];
        logsByDate[dateStr] = log.taken;
      });

      const allWeeks = {};

      for (let i = 0; i <= totalDays; i++) {
        const date = new Date(createdAt);
        date.setDate(createdAt.getDate() + i);
        date.setHours(0, 0, 0, 0);

        const dateStr = date.toISOString().split("T")[0];
        const taken = logsByDate[dateStr] ?? false;

        const dayOfWeek = date.getDay();
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weekKey = weekStart.toISOString();

        if (!allWeeks[weekKey]) {
          allWeeks[weekKey] = {
            weekStart,
            weekEnd,
            logs: []
          };
        }

        allWeeks[weekKey].logs.push({
          date,
          taken
        });
      }

      // Write rows grouped by week
      for (const week of Object.values(allWeeks)) {
        for (const log of week.logs) {
          sheet.addRow({
            username: patient.username,
            phoneNumber: patient.phoneNumber,
            weekStart: week.weekStart.toISOString().split("T")[0],
            weekEnd: week.weekEnd.toISOString().split("T")[0],
            date: log.date.toISOString().split("T")[0],
            taken: log.taken ? 'Yes' : 'No',
          });
        }
      }
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Weekly_Patient_Progress.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("❌ Error exporting weekly grouped logs:", error);
    res.status(500).json({ message: "Failed to export weekly logs" });
  }
};



exports.exportAllWeeklyReports = async (req, res) => {
  try {
    const symptoms = await Symptom.find().sort("name");
    const symptomNames = symptoms.map(s => s.name);

    const patients = await User.find({ role: "patient" }).select("_id username phoneNumber createdAt");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Weekly Symptom Overview");

    // Dynamic columns
    sheet.columns = [
      { header: "Username", key: "username", width: 20 },
      { header: "Phone Number", key: "phone", width: 15 },
      { header: "Week Start", key: "weekStart", width: 15 },
      { header: "Week End", key: "weekEnd", width: 15 },
      ...symptomNames.map(name => ({
        header: name,
        key: name,
        width: 20,
      })),
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const patient of patients) {
      const createdAt = new Date(patient.createdAt);
      createdAt.setHours(0, 0, 0, 0);

      // Align to Monday
      const firstWeekStart = new Date(createdAt);
      const startDay = firstWeekStart.getDay();
      firstWeekStart.setDate(firstWeekStart.getDate() - (startDay === 0 ? 6 : startDay - 1));

      const reports = await WeeklyReport.find({ userId: patient._id })
        .populate("symptoms.symptomId", "name")
        .sort({ weekStart: 1 });

      const reportsByWeek = {};
      for (const report of reports) {
        const key = report.weekStart.toISOString().split("T")[0];
        reportsByWeek[key] = report;
      }

      // Go week by week
      let currentWeekStart = new Date(firstWeekStart);
      while (currentWeekStart <= today) {
        const weekKey = currentWeekStart.toISOString().split("T")[0];
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6);

        const row = {
          username: patient.username,
          phone: patient.phoneNumber,
          weekStart: weekKey,
          weekEnd: weekEnd.toISOString().split("T")[0],
        };

        // Init symptoms as "-"
        symptomNames.forEach(name => {
          row[name] = "-";
        });

        const report = reportsByWeek[weekKey];
        if (report) {
          for (const entry of report.symptoms) {
            const name = entry.symptomId?.name;
            if (name && symptomNames.includes(name)) {
              row[name] = entry.hasSymptom ? "Yes" : "No";
            }
          }
        } else {
          // Optional: you can leave row as-is or mark all symptoms as "No report"
        }

        sheet.addRow(row);
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Weekly_Symptom_Overview.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Error exporting pivoted weekly reports:", err);
    res.status(500).json({ message: "Failed to export weekly reports" });
  }
};
