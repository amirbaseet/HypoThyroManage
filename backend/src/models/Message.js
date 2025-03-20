const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    encryptedMessage: { type: String, required: true }, //  Store encrypted messages
    aesKey: { type: String, required: true }, // Store encrypted AES key
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
