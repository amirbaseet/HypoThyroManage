const User = require("../models/userModels");
const MedicineLog = require("../models/MedicineLog");

// ✅ Get all users with valid push tokens
const getAllUsers = async () => {
  return await User.find({ pushToken: { $exists: true, $ne: null } });
};

// ✅ Get patients who haven't logged their medicine today
const getPatientsWithoutLogs = async (today) => {
  const patients = await User.find({ role: "patient", pushToken: { $exists: true } });

  const todayLogs = await MedicineLog.find({ date: today }).select("userId");
  const loggedUserIds = new Set(todayLogs.map(log => log.userId.toString()));

  const patientsWithoutLogs = patients.filter(
    patient => !loggedUserIds.has(patient._id.toString())
  );

  return patientsWithoutLogs;
};

module.exports = {
  getAllUsers,
  getPatientsWithoutLogs
};
