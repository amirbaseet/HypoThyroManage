const ExcelJS = require('exceljs');
const MedicineLog = require('../models/MedicineLog');
const User = require('../models/userModels');
const WeeklyReport = require('../models/weeklyReport');
const Symptom = require("../models/Symptom");


exports.exportAllMedicineLogs = async (req, res) => {
  try {
    const requestingUser = req.user;

    let patientsQuery = { role: "patient" };

    // if (requestingUser.role === "doctor") {
    //   patientsQuery.doctorId = requestingUser._id;
    // } else if (requestingUser.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    const patients = await User.find(patientsQuery).select("_id username phoneNumber");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('All Patients Medicine Logs');

    // 📋 Header row
    sheet.columns = [
      { header: 'Patient Name', key: 'username', width: 20 },
      { header: 'Phone Number', key: 'phoneNumber', width: 20 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Taken', key: 'taken', width: 10 },
      { header: 'Day', key: 'day', width: 10 },
      { header: 'Month', key: 'month', width: 10 },
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Week Start', key: 'weekStart', width: 20 },
      { header: 'Week End', key: 'weekEnd', width: 20 },
    ];

    for (const patient of patients) {
      const logs = await MedicineLog.find({ userId: patient._id }).sort({ date: 1 });

      logs.forEach(log => {
        sheet.addRow({
          username: patient.username,
          phoneNumber: patient.phoneNumber,
          date: log.date.toISOString().split("T")[0],
          taken: log.taken ? 'Yes' : 'No',
          day: log.day,
          month: log.month,
          year: log.year,
          weekStart: log.weekStart.toISOString().split("T")[0],
          weekEnd: log.weekEnd.toISOString().split("T")[0],
        });
      });
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=All_Medicine_Logs.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("❌ Error exporting all logs:", error);
    res.status(500).json({ message: "Failed to export Excel for all users" });
  }
};


exports.exportAllWeeklyReports = async (req, res) => {
  try {

    // Get all weekly reports + user + symptoms
    const reports = await WeeklyReport.find({})
      .populate("userId", "username phoneNumber doctorId")
      .populate("symptoms.symptomId", "name")
      .sort({ weekStart: -1 });

    // If doctor, filter only their patients' reports
    let filteredReports = reports;
    // if (req.user.role === "doctor") {
    //   filteredReports = reports.filter(
    //     report => String(report.userId.doctorId) === String(req.user.id)
    //   );
    // }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Weekly Symptom Reports");

    // Set up columns
    sheet.columns = [
      { header: "Username", key: "username", width: 20 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Week Start", key: "weekStart", width: 15 },
      { header: "Week End", key: "weekEnd", width: 15 },
      { header: "Symptom", key: "symptom", width: 25 },
      { header: "Had Symptom", key: "hasSymptom", width: 15 },
    ];

    // Add rows
    for (const report of filteredReports) {
      const { userId, weekStart, weekEnd, symptoms } = report;

      for (const symptomEntry of symptoms) {
        sheet.addRow({
          username: userId.username,
          phone: userId.phoneNumber,
          weekStart: weekStart.toISOString().split("T")[0],
          weekEnd: weekEnd.toISOString().split("T")[0],
          symptom: symptomEntry.symptomId?.name || "Unknown",
          hasSymptom: symptomEntry.hasSymptom ? "Yes" : "No",
        });
      }
    }

    // Send Excel response
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=All_Weekly_Reports.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Error exporting weekly reports:", err);
    res.status(500).json({ message: "Failed to export weekly reports" });
  }
};
