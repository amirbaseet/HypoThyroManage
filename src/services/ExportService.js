import api from "api/apiService"; // assuming your axios instance is in api.js
import { API_ROUTES } from 'constants/apiRoutes';

export const exportAllMedicineLogs = async () => {
  // return await api.get("/exportToExcel/export-all-medicine-logs", {
  return await api.get(API_ROUTES.EXPORT_ALL_MEDICINE_LOGS, {
    responseType: "arraybuffer", // fetch as binary buffer
  });
};

export const exportWeeklyReports = async () => {
  // return await api.get("/exportToExcel/export-weekly-reports", {
  return await api.get(API_ROUTES.EXPORT_WEEKLY_REPORTS, {
    responseType: "arraybuffer",
  });
};

export const exportSpecifiedWeekReports = async () => {
  // return await api.get("/exportToExcel/export-specified-week-reports", {
  return await api.get(API_ROUTES.EXPORT_SPECIFIED_WEEK_REPORTS, {
    responseType: "arraybuffer",
  });
};
