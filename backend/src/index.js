const express = require("express");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv");
const cors = require("cors");

const { server, app } = require("./socket"); // Import server and app from socket.js
const Symptom = require("./models/Symptom");
const Message = require("./models/Message");

dotenv.config();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const reportRoutes = require("./routes/reportRoutes");
const messageRoutes = require("./routes/messageRoutes");
const pushNotificationRoutes = require("./routes/pushNotificationRoutes");
// Admin & Patient Routes for Symptom Forms
const adminRoutes = require("./routes/adminRoutes");
const patientRoutes = require("./routes/patientRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const exportToExcelRoutes = require("./routes/exportToExcelRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", pushNotificationRoutes);  
app.use("/api/admin", adminRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/exportToExcel", exportToExcelRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Connect to Database
dbConnect();

// Insert Default Symptoms if Not Present
const insertSymptoms = async () => {
    try {
        const symptoms = [
            "Kabızlık", "Halsizlik", "Yorgunluk", "Kilo alma",
            "Cilt kuruluğu", "Saç dökülmesi", "Üşüme", "Hareketlerde yavaşlama",
            "Ses değişikliği (kısılması/boğukluğu)", "Unutkanlık / Hafızada zayıflama",
            "Kas krampları", "Eklem ağrısı", "Depresif ruh halinde olma",
            "Sinirlilik", "Konuşmada yavaşlama", "Cinsel isteksizlik",
            "Konsantrasyon/odaklanmada zorlanma", "Adet düzensizliği",
            "Hareket halindeyken nefes darlığı", "Ödem/şişlik"
        ];

        const existingSymptoms = await Symptom.countDocuments();
        if (existingSymptoms === 0) {
            await Symptom.insertMany(symptoms.map(name => ({ name })));
            console.log("✅ Symptoms added successfully!");
        } else {
            console.log("⚠️ Symptoms already exist, skipping insertion.");
        }
    } catch (error) {
        console.error("❌ Error inserting symptoms:", error);
    }
};

// Run the function once when the server starts
insertSymptoms();

// Start Server
server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
