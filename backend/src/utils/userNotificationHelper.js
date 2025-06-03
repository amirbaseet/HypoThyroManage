/**
 * User Notification Helper Functions
 * 
 * Provides utilities for fetching user data relevant to push notifications:
 * - All users with push tokens
 * - Patients without medicine logs for today
 * - All doctors
 */

const User = require("../models/userModels");
const MedicineLog = require("../models/MedicineLog");

/**
 * Get all users who have a valid push token (used for sending notifications).
 * 
 * @returns {Promise<Array>} Array of User documents with push tokens.
 */
const getAllUsers = async () => {
  return await User.find({ pushToken: { $exists: true, $ne: null } });
};
/**
 * Get all patients who have not logged their medicine intake for today.
 * 
 * @param {Date} today - The start of today (Date object with time set to 00:00:00).
 * @returns {Promise<Array>} Array of User documents (patients without logs).
 * 
 * @example
 * const today = new Date();
 * today.setHours(0,0,0,0);
 * const patients = await getPatientsWithoutLogs(today);
 */
const getPatientsWithoutLogs = async (today) => {
  const patients = await User.find({ role: "patient", pushToken: { $exists: true } });

  const todayLogs = await MedicineLog.find({ date: today }).select("userId");
  const loggedUserIds = new Set(todayLogs.map(log => log.userId.toString()));

  const patientsWithoutLogs = patients.filter(
    patient => !loggedUserIds.has(patient._id.toString())
  );

  return patientsWithoutLogs;
};
/**
 * Get all users with the role "doctor".
 * 
 * @returns {Promise<Array>} Array of User documents with role "doctor".
 */
const getDoctors = async () => {
  return await User.find({ role: "doctor" });
};

module.exports = {
  getAllUsers,
  getPatientsWithoutLogs,
  getDoctors
};
