// src/constants/apiRoutes.js

export const API_ROUTES = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  RESET_PASSWORD: "/auth/admin/reset-password",
  UPDATE_PUSH_TOKEN: "/auth/update-push-token",
  REMOVE_PUSH_TOKEN: "/auth/remove-push-token",

  // Notifications
  SEND_TO_ALL_NOTIFICATIONS: "/notifications/send-to-all",

  // Admin Form Windows
  CREATE_FORM_WINDOW: "/admin/form-windows",
  TOGGLE_FORM_WINDOW_STATUS: (id) => `/admin/form-windows/${id}/toggle`,
  GET_ALL_FORM_WINDOWS: "/admin/form-windows",

  // Chat / Messages
  SEND_MESSAGE: "/messages/send",
  GET_CHAT_HISTORY: "/messages/chatHistory",
  MARK_MESSAGES_READ: "/messages/markAsRead",
  GET_DOCTOR_CHAT_LIST: "/messages/doctor-chats",
  GET_UNREAD_MESSAGE_COUNT: (userId) => `/messages/unread-count?userId=${userId}`,

  // Doctor
  GET_DOCTOR_REPORTS: (doctorId) => `/reports/doctor/${doctorId}`,

  // Medicine
  MARK_MEDICINE_TAKEN: "/medicine/take",
  GET_WEEKLY_PROGRESS: "/medicine/progress",
  GET_MISSED_MEDICINE_USERS: "/medicine/missed-medicine-users",

  // Reports
  GET_USER_REPORTS: (userId) => `/reports/${userId}`,
  GET_LATEST_WEEKLY_REPORT: (userId) => `/reports/latest-report/${userId}`,
  SUBMIT_WEEKLY_REPORT: "/reports/submit-report",

  // Patient Forms
  GET_ACTIVE_FORM_WINDOWS: "/patient/form-windows/active",
  GET_LATEST_SYMPTOM_FORM: "/patient/form-submissions/latest",
  GET_LATEST_COPING_FORM: "/patient/coping",
  SUBMIT_SYMPTOM_FORM: "/patient/form-submissions",
  GET_FORM_SUBMISSIONS: "/patient/form-submissions",

  // Symptoms
  GET_SYMPTOMS: "/symptoms",

  //Videos
  GET_VIDEO_URL: '/videos/get-video-url',
  
  // Exports
  EXPORT_ALL_MEDICINE_LOGS: "/exportToExcel/export-all-medicine-logs",
  EXPORT_WEEKLY_REPORTS: "/exportToExcel/export-weekly-reports",
  EXPORT_SPECIFIED_WEEK_REPORTS: "/exportToExcel/export-specified-week-reports",
};
