const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

router.post("/send", async (req, res) => {
    try {
        const { expoPushToken, messageTitle, messageBody } = req.body;

        if (!expoPushToken) {
            return res.status(400).json({ error: "Expo Push Token is required" });
        }

        const message = {
            to: expoPushToken,
            sound: "default",
            title: messageTitle,
            body: messageBody,
            data: { someData: "goes here" },
        };

        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });

        const data = await response.json();
        return res.status(200).json({ success: true, response: data });
    } catch (error) {
        console.error("❌ Error sending push notification:", error);
        return res.status(500).json({ error: "Failed to send push notification" });
    }
});

module.exports = router;
