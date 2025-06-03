/**
 * Reminder Scheduler
 * 
 * Schedules and sends push notifications to users based on specific times and conditions:
 * - 07:00: Daily medicine reminder for all users
 * - 19:00: Weekly report reminder for all users (Sun, Wed, Fri)
 * - 12:00: Daily check for patients without medicine logs
 */
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


/**
 * Send scheduled reminders based on the current time and day.
 * 
 * - 07:00: Send daily medicine reminder to all users
 * - 19:00 (Sun, Wed, Fri): Send weekly report reminder to all users
 * - 12:00: Send reminder to patients without medicine logs, and notify doctors
 * 
 * Logs status and errors for each notification batch.
 * 
 * @async
 * @function sendAllReminders
 */

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
      
            // Patients → TakeMedicineScreen
            await sendNotificationto(users, dailyNotificationText, dailyNotificationText.page, {});

            
            console.log(`🕒 [Reminder Triggered - ${now.format("dddd")} @ ${formattedTime}]`);
            console.log(`✅ Sent ${users.length} 7AM reminders.`);
          }
      
          // 7PM Weekly Reminder (Sun, Wed, Fri)
          if (hour === 19 && [0, 3, 5].includes(dayOfWeek)) {
         
            await sendNotificationto(users, weeklyNotificationText,weeklyNotificationText.page,{});
            console.log(`🕒 [Reminder Triggered - ${now.format("dddd")} @ ${formattedTime}]`);
            console.log(`✅ Sent ${users.length} 7PM reminders.`);
          }
            
          // 12PM: Check for patients with no medicine logs
          if (hour === 12) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
      
            const patientsWithoutLogs = await getPatientsWithoutLogs(today);
            await sendNotificationto(patientsWithoutLogs, dayilyRemRemindernotificationText,dayilyRemRemindernotificationText.page,{});
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

