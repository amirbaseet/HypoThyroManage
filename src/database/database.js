import * as SQLite from "expo-sqlite";

// Open SQLite Database
let db;
async function openDatabase() {
    if (!db) {
        db = await SQLite.openDatabaseAsync("medTracker.db");
    }
    return db;
}
// Ensure database is opened before using it
(async () => {
    db = await openDatabase();
})();

// Initialize Database Tables
export async function initializeDatabase() {
    try {
        await db.execAsync("PRAGMA foreign_keys = ON;");
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                role TEXT NOT NULL
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

// Delete All Data from Database
export async function deleteAllData() {
  try {
    //   const db = await openDatabase();

      // Delete all records (soft reset)
      await db.execAsync("DELETE FROM users;");
      await db.execAsync("VACUUM;");  // Reset database file size

      console.log("🗑️ All data deleted from the database.");
  } catch (error) {
      console.error("❌ Error deleting all data:", error);
  }
}
// Reset Database (Drop and Recreate Tables)
export async function resetDatabase() {
  try {
    //   const db = await openDatabase();

      // Drop tables (hard reset)
      await db.execAsync("DROP TABLE IF EXISTS users;");

      // Reinitialize database
      await initializeDatabase();

      console.log("🔄 Database reset successfully.");
  } catch (error) {
      console.error("❌ Error resetting database:", error);
  }
}

export { db };
