const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Symptom = require('../models/Symptom');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB Connected");
}).catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
});

// Define symptoms list
const symptoms = [
    "Kabızlık", "Halsizlik", "Yorgunluk", "Kilo alma",
    "Cilt kuruluğu", "Saç dökülmesi", "Üşüme", "Hareketlerde yavaşlama",
    "Ses değişikliği (kısılması/boğukluğu)", "Unutkanlık / Hafızada zayıflama",
    "Kas krampları", "Eklem ağrısı", "Depresif ruh halinde olma",
    "Sinirlilik", "Konuşmada yavaşlama", "Cinsel isteksizlik",
    "Konsantrasyon/odaklanmada zorlanma", "Adet düzensizliği",
    "Hareket halindeyken nefes darlığı", "Ödem/şişlik"
];

// Insert symptoms into MongoDB
const insertSymptoms = async () => {
    try {
        // Check if symptoms already exist
        const existingSymptoms = await Symptom.countDocuments();
        if (existingSymptoms > 0) {
            console.log("⚠️ Symptoms already exist, skipping insertion.");
            mongoose.connection.close();
            return;
        }

        // Insert new symptoms
        await Symptom.insertMany(symptoms.map(name => ({ name })));
        console.log("✅ Symptoms inserted successfully!");
    } catch (error) {
        console.error("❌ Error inserting symptoms:", error);
    } finally {
        mongoose.connection.close(); // Close connection
    }
};

// Run the function
insertSymptoms();
