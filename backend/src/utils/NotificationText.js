const weeklyNotificationText = {
  title: "Haftalık bildirim",
  body: "Raporlar bölümünden haftalık semptom bildirimini yapınız.",
  page: "Report",
};
const dailyNotificationText = {
  title: "Günaydın! ☀️",
  body: "Bugün tiroid ilacınızı almayı unutmayın!",
  page: "TakeMedicineScreen"
};
const dayilyRemRemindernotificationText = {
  title: "💊 İlaç Hatırlatıcısı",
  body: "Bugün henüz ilaç kaydınız yapılmadı. Lütfen unutmayın!",
  page: "TakeMedicineScreen"
};
const getNotificationMessage = (receiverUser, senderUser, senderId) => {
  let notificationMessage = `You have a new message`;
  let targetScreen = null;
  let targetParams = null;

  if (receiverUser.role === "doctor") {
    notificationMessage = `You have a new message from ${senderUser.username}`;
    targetScreen = "DoctorChat";
    targetParams = { chatId: senderId };
  } else if (receiverUser.role === "patient") {
    notificationMessage = `You have a new message from Doctor ${senderUser.username}`;
    targetScreen = "PatientChat";
    targetParams = { chatId: senderId };
  } else {
    // Fallback for unknown roles
    notificationMessage = `You have a new message`;
    targetScreen = null;
    targetParams = null;
  }

  return { notificationMessage, targetScreen, targetParams };
};



module.exports = {
    weeklyNotificationText,
    dailyNotificationText,
    dayilyRemRemindernotificationText,
    getNotificationMessage
  };
  