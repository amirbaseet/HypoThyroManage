const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.Conn_Strng, {
        });

        console.log(`✅ Database connected: ${connect.connection.host}, ${connect.connection.name}`);
    } catch (err) {
        console.error("❌ Database connection error:", err.message);
        process.exit(1); // Exit process on failre
    }
}; 

module.exports = dbConnect;