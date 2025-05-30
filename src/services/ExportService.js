import api from "api/apiService"; // assuming your axios instance is in api.js

export const exportAllMedicineLogs = async () => {
  return await api.get("/exportToExcel/export-all-medicine-logs", {
    responseType: "arraybuffer", // fetch as binary buffer
  });
};

export const exportWeeklyReports = async () => {
  return await api.get("/exportToExcel/export-weekly-reports", {
    responseType: "arraybuffer",
  });
};

export const exportSpecifiedWeekReports = async () => {
  return await api.get("/exportToExcel/export-specified-week-reports", {
    responseType: "arraybuffer",
  });
};
