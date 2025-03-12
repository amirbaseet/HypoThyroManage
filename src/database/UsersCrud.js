import { db } from "./database";
//fetch all users
const fileName = `IN USerCrud`;
export const getLocalUsers = async () => {
    try {
        const statement = await db.prepareAsync(`SELECT * FROM users`); // Prepare the query
        const result = await statement.executeAsync();
        const rows = await result.getAllAsync();


        if (rows.length === 0) {
            console.warn("⚠️ No users found in the local database.");
            return [];
        }

        console.log("📋 Users Retrieved:", rows[1]);
        return rows;  // ✅ Correctly return users
    } catch (error) {
        console.error(`❌ ${fileName} Error fetching local users:`, error);
        return [];
    }
};

export async function saveUserToLocalDB(user) {
    try {

        console.log(`🔍 Checking if user (${user.email}) exists...`);
        const existingUser = await db.getFirstAsync(`SELECT id FROM users WHERE email = ?`, [user.email]);
        console.log("exist?=",existingUser);
        if (!existingUser) {
            console.log("User does not exist. Inserting...");
            const insertQuery = `INSERT INTO users (id, username, email, role) VALUES (?, ?, ?, ?)`;
            await db.runAsync(insertQuery, [user.id, user.username, user.email, user.role]);
        }
        console.log(`✅ User (${user.email}) processed successfully.`);
  

    } catch (err) {
        console.error(`❌ ${fileName}  in USerCrud Error saving user to local DB:`, err.message);
    }
}
