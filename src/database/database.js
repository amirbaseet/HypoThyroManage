import * as SQLite from "expo-sqlite";

// Open SQLite Database
let db;
async function openDatabase() {
    if (!db) {
        db = await SQLite.openDatabaseAsync("medTracker.db");
    }
    return db;
}

// Initialize Database Tables
export async function initializeDatabase() {
    try {
        const db = await openDatabase();
        await db.execAsync("PRAGMA foreign_keys = ON;");

        await db.execAsync(`
                CREATE TABLE IF NOT EXISTS medications (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT NOT NULL, 
                dosage TEXT NOT NULL, 
                frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')) NOT NULL, 
                time_of_day TEXT, 
                start_date TEXT NOT NULL CHECK (LENGTH(start_date) = 10), 
                end_date TEXT CHECK (LENGTH(end_date) = 10)
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS medication_logs (
   id INTEGER PRIMARY KEY AUTOINCREMENT, 
                medication_id INTEGER NOT NULL, 
                timestamp TEXT NOT NULL CHECK (LENGTH(timestamp) = 19), 
                status TEXT NOT NULL DEFAULT 'pending', 
                FOREIGN KEY (medication_id) REFERENCES medications(id)
            );
        `);

        console.log("✅ Database initialized successfully.");
    } catch (err) {
        console.error("❌ Database initialization error:", err);
    }
}
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];  // Extract YYYY-MM-DD
};

// Insert New Medication
export async function insertMedication(name, dosage, frequency, time_of_day, start_date, end_date) {
    try {
        const db = await openDatabase();
        await db.withTransactionAsync(async () => {
            const query = `INSERT INTO medications (name, dosage, frequency, time_of_day, start_date, end_date)
                           VALUES (?, ?, ?, ?, ?, ?)`;
            await db.runAsync(query, [name, dosage, frequency, JSON.stringify(time_of_day), formatDate(start_date), formatDate(end_date)]);
        });
        console.log("✅ Medication inserted successfully.");
    } catch (error) {
        console.error("❌ Error inserting medication:", error);
    }
}

// Fetch All Medications (Fix JSON Parsing)
export async function fetchMedications() {
    try {
        const db = await openDatabase();
        const statement = await db.prepareAsync("SELECT * FROM medications");
        const result = await statement.executeAsync();
        const medications = await result.getAllAsync();

        // Convert time_of_day from JSON string back to an array (Handle errors)
        return medications.map(med => ({
            ...med,
            time_of_day: safeJsonParse(med.time_of_day, []),
        }));
    } catch (error) {
        console.error("❌ Error in fetchMedications:", error);
        return [];
    }
}

// Function to safely parse JSON
function safeJsonParse(data, fallback) {
    try {
        return data ? JSON.parse(data) : fallback;
    } catch (error) {
        console.error("❌ JSON parsing error:", error);
        return fallback;
    }
}

// Log Medication Intake
export async function logMedication(medication_id, status) {
    try {
        const db = await openDatabase();
        const timestamp = new Date().toISOString();
        await db.withTransactionAsync(async () => {
            const query = `INSERT INTO medication_logs (medication_id, timestamp, status) 
                           VALUES (?, ?, ?)`;
            await db.runAsync(query, [medication_id, timestamp, status]);
        });
        console.log("✅ Medication log inserted successfully.");
    } catch (error) {
        console.error("❌ Error logging medication:", error);
    }
}

// Fetch Medication Logs
export async function fetchMedicationLogs() {
    try {
        const db = await openDatabase();
        const statement = await db.prepareAsync("SELECT * FROM medication_logs");
        const result = await statement.executeAsync();
        return await result.getAllAsync();
    } catch (error) {
        console.error("❌ Error in fetchMedicationLogs:", error);
        return [];
    }
}
// Delete All Data from Database
export async function deleteAllData() {
  try {
      const db = await openDatabase();
      
      // Delete all records (soft reset)
      await db.execAsync("DELETE FROM medication_logs;");
      await db.execAsync("DELETE FROM medications;");
      await db.execAsync("VACUUM;");  // Reset database file size

      console.log("🗑️ All data deleted from the database.");
  } catch (error) {
      console.error("❌ Error deleting all data:", error);
  }
}
// Reset Database (Drop and Recreate Tables)
export async function resetDatabase() {
  try {
      const db = await openDatabase();

      // Drop tables (hard reset)
      await db.execAsync("DROP TABLE IF EXISTS medication_logs;");
      await db.execAsync("DROP TABLE IF EXISTS medications;");
      
      // Reinitialize database
      await initializeDatabase();

      console.log("🔄 Database reset successfully.");
  } catch (error) {
      console.error("❌ Error resetting database:", error);
  }
}

export { db };
