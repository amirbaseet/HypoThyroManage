
const User = require("../models/userModels");

const { sendNotificationToAllUsers } = require("../utils/notificationService");

exports.sendNotificationToAll = async (req, res) => {
    try {
        const {  title, message } = req.body;

        // ✅ Send notifications
        await sendNotificationToAllUsers(title, message);

        res.status(200).json({ message: "Notifications sent successfully to all users." });
    } catch (error) {
        console.error("❌ Error sending notification to all users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
