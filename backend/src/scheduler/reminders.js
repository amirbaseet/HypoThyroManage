// src/scheduler/reminders.js
const moment = require("moment-timezone");
const { sendNotificationto } = require("../utils/notificationService");
const {
  weeklyNotificationText,
  dailyNotificationText,
  dayilyRemRemindernotificationText
} = require("../utils/NotificationText"); // adjust path as needed
const {
  getAllUsers,
  getPatientsWithoutLogs,
  getDoctors
} = require("../utils/userNotificationHelper"); // Adjust path if needed

     exports.sendAllReminders = async () => {
        const now = moment().tz("Europe/Istanbul");
        const formattedTime = now.format("YYYY-MM-DD HH:mm:ss");
        const dayOfWeek = now.day(); // 0 = Sunday
        const hour = now.hour();     // 0 - 23
      
      
        try {
          const users = await getAllUsers();
          const Doctors = await getDoctors();
          // 7AM Reminder
          if (hour === 7) {
      
            await sendNotificationto(users, dailyNotificationText);
            
            console.log(`🕒 [Reminder Triggered - ${now.format("dddd")} @ ${formattedTime}]`);
            console.log(`✅ Sent ${users.length} 7AM reminders.`);
          }
      
          // 7PM Weekly Reminder (Sun, Wed, Fri)
          if (hour === 19 && [0, 3, 5].includes(dayOfWeek)) {
         
            await sendNotificationto(users, weeklyNotificationText);
            console.log(`🕒 [Reminder Triggered - ${now.format("dddd")} @ ${formattedTime}]`);
            console.log(`✅ Sent ${users.length} 7PM reminders.`);
          }
            
          // 12PM: Check for patients with no medicine logs
          if (hour === 12) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
      
            const patientsWithoutLogs = await getPatientsWithoutLogs(today);
            await sendNotificationto(patientsWithoutLogs, dayilyRemRemindernotificationText);
            await sendNotificationto(Doctors, dayilyRemRemindernotificationText);
            console.log(`🕒 [Reminder Triggered - ${now.format("dddd")} @ ${formattedTime}]`);
            console.log(`[12PM Reminder] ✅ Sent to ${patientsWithoutLogs.length} patients without logs`);
          }
            
        } catch (error) {
          console.error("❌ Error sending reminders:", {
            message: error.message,
            stack: error.stack,
            time: formattedTime,
        });
            }
      };

