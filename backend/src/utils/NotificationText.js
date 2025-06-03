/**
 * Haftalık bildirim metni (örneğin: Pazar, Çarşamba, Cuma - 19:00)
 */
const weeklyNotificationText = {
  title: "Haftalık bildirim",
  body: "Raporlar bölümünden haftalık semptom bildirimini yapınız.",
  page: "Report",
};
/**
 * Günlük sabah bildirim metni (örneğin: 07:00)
 */
const dailyNotificationText = {
  title: "Günaydın! ☀️",
  body: "Bugün tiroid ilacınızı almayı unutmayın!",
  page: "TakeMedicineScreen"
};
/**
 * Günlük ilaç hatırlatma bildirimi (örneğin: 12:00)
 */
const dayilyRemRemindernotificationText = {
  title: "💊 İlaç Hatırlatıcısı",
  body: "Bugün henüz ilaç kaydınız yapılmadı. Lütfen unutmayın!",
  page: "TakeMedicineScreen"
};
/**
 * Kullanıcı rollerine ve gönderen bilgilerine göre bildirim metni ve hedef ekranını belirler.
 * 
 * @param {Object} receiverUser - Mesajı alan kullanıcı (örneğin: doktor veya hasta)
 * @param {Object} senderUser - Mesajı gönderen kullanıcı (örneğin: doktor veya hasta)
 * @param {string} senderId - Gönderenin kullanıcı ID'si (chatId olarak kullanılır)
 * @returns {Object} Bildirim nesnesi:
 *   - {string} notificationMessage: Gösterilecek mesaj metni
 *   - {string|null} targetScreen: Bildirimle gidilecek ekran adı (DoctorChat veya PatientChat), yoksa null
 *   - {Object|null} targetParams: Bildirimle gidilecek ek parametreler (örneğin { chatId: senderId }), yoksa null
 */
const getNotificationMessage = (receiverUser, senderUser, senderId) => {
  let notificationMessage =  `Yeni bir mesajınız var`;
  let targetScreen = null;
  let targetParams = null;

  if (receiverUser.role === "doctor") {
    notificationMessage = `${senderUser.username} dan yeni bir mesajınız var`;
    targetScreen = "DoctorChat";
    targetParams = { chatId: senderId };
  } else if (receiverUser.role === "patient") {
    notificationMessage = `Doktor ${senderUser.username} tarafından yeni bir mesaj aldınız`;
    targetScreen = "PatientChat";
    targetParams = { chatId: senderId };
  } else {
    // Fallback for unknown roles
    notificationMessage =  `Yeni bir mesajınız var`;
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
  