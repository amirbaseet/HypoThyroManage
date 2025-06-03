/**
 * Symptom Seeder Script
 *
 * Connects to MongoDB and inserts a predefined list of symptoms into the database.
 * Ensures symptoms are not duplicated by checking existing entries first.
 * Can be run as a standalone script.
 */
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


/**
 * Predefined list of symptom names to seed into the database.
 */
const symptoms = [
    "Kabızlık", "Halsizlik", "Yorgunluk", "Kilo alma",
    "Cilt kuruluğu", "Saç dökülmesi", "Üşüme", "Hareketlerde yavaşlama",
    "Ses değişikliği (kısılması/boğukluğu)", "Unutkanlık / Hafızada zayıflama",
    "Kas krampları", "Eklem ağrısı", "Depresif ruh halinde olma",
    "Sinirlilik", "Konuşmada yavaşlama", "Cinsel isteksizlik",
    "Konsantrasyon/odaklanmada zorlanma", "Adet düzensizliği",
    "Hareket halindeyken nefes darlığı", "Ödem/şişlik"
];

/**
 * Inserts the symptom list into the MongoDB collection.
 * Skips insertion if symptoms already exist.
 *
 * @async
 * @function insertSymptoms
 * @returns {Promise<void>}
 */
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

// Run the script
insertSymptoms();
