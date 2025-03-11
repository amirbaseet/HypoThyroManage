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
// Fetch local Users
export const getLocalUsers = async () => {
    try {
        const db = await openDatabase();
        const statement = await db.prepareAsync(`SELECT * FROM users`); // Prepare the query
        const result = await statement.executeAsync();
        const rows = await result.getAllAsync();


        if (rows.length === 0) {
            console.warn("⚠️ No users found in the local database.");
            return [];
        }

        // console.log("📋 Users Retrieved:", rows);
        return rows;  // ✅ Correctly return users
    } catch (error) {
        console.error('❌ Error fetching local users:', error);
        return [];
    }
};
export async function saveUserToLocalDB(user) {
    try {
        const db = await openDatabase();

        console.log(`🔍 Checking if user (${user.email}) exists...`);
        const existingUser = await db.getFirstAsync(`SELECT id FROM users WHERE email = ?`, [user.email]);

        if (!existingUser) {
            console.log("User does not exist. Inserting...");
            const insertQuery = `INSERT INTO users (id, username, email, role) VALUES (?, ?, ?, ?)`;
            await db.runAsync(insertQuery, [user.id, user.username, user.email, user.role]);
        }
        console.log(`✅ User (${user.email}) processed successfully.`);
  

    } catch (err) {
        console.error("❌ Error saving user to local DB:", err.message);
    }
}
export function formatDate(date) {
    if (!date || date.trim() === "") return null; // ✅ Fix: Return null if date is empty or invalid

    try {
        const formattedDate = new Date(date).toISOString().split('T')[0]; // ✅ Ensure ISO format
        return formattedDate;
    } catch (error) {
        console.error("❌ Date Formatting Error:", error);
        return null; // ✅ Prevent crashes
    }
}




// Delete All Data from Database
export async function deleteAllData() {
  try {
      const db = await openDatabase();
      
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
        const db = await openDatabase();

        console.log("🔄 Resetting Database...");
        
        // ✅ Disable foreign key constraints temporarily
        await db.execAsync("PRAGMA foreign_keys = OFF;");
        
        // ✅ Delete data instead of dropping tables to avoid locking
        await db.execAsync("DELETE FROM users;");
        
        // ✅ Optimize database storage
        await db.execAsync("VACUUM;");

        // ✅ Re-enable foreign key constraints
        await db.execAsync("PRAGMA foreign_keys = ON;");

        console.log("✅ Database reset successfully.");
    } catch (error) {
        console.error("❌ Error resetting database:", error.message);
    }
}

export { db };
