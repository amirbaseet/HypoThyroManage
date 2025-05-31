import { db } from "./database";
const fileName = `IN DropDB`;

// Delete All Data from Database
export async function deleteAllData() {
    try {
  
        // Delete all records (soft reset)
        await db.execAsync("DELETE FROM users;");
        await db.execAsync("VACUUM;");  // Reset database file size
  
        console.log("🗑️ All data deleted from the database.");
    } catch (error) {
        console.error(`❌${fileName} Error deleting all data:`, error);
    }
  }
  // Reset Database (Drop and Recreate Tables)
  export async function resetDatabase() {
    try {
  
        // Drop tables (hard reset)
        await db.execAsync("DROP TABLE IF EXISTS users;");
  
        // Reinitialize database
  
        console.log("🔄 Database reset successfully.");
    } catch (error) {
        console.error(`❌${fileName} Error resetting database:`, error);
    }
  }
    