const Message = require("../models/Message");
const User = require("../models/userModels");
const { generateAESKey, encryptMessageAES, decryptMessageAES, encryptAESKeyWithRSA, decryptAESKeyWithRSA } = require("../utils/encryptionUtils");

/**
 *  Send Message (Patient ↔ Doctor)
 */
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        // Fetch public & private keys
        const sender = await User.findById(senderId).select("privateKey");
        const receiver = await User.findById(receiverId).select("publicKey");

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate & encrypt AES key
        const aesKey = generateAESKey();
        const encryptedAESKey = encryptAESKeyWithRSA(aesKey, receiver.publicKey);
        const encryptedMessage = encryptMessageAES(message, aesKey);

        // Save message in DB
        const newMessage = new Message({
            senderId,
            receiverId,
            encryptedMessage,
            aesKey: encryptedAESKey, // Store encrypted AES key
        });

        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Get Chat History (Decrypt Messages)
 */
exports.getChatHistory = async (req, res) => {
    try {
        const { user1, user2 } = req.body;

        // ✅ Fetch both users and their private keys
        const userOne = await User.findById(user1).select("privateKey");
        const userTwo = await User.findById(user2).select("privateKey");

        if (!userOne || !userTwo) {
            return res.status(400).json({ message: "One or both users not found" });
        }

        // console.log(`🔹 User1 Private Key: ${userOne.privateKey ? "Exists" : "Missing"}`);
        // console.log(`🔹 User2 Private Key: ${userTwo.privateKey ? "Exists" : "Missing"}`);

        // ✅ Fetch messages
        const messages = await Message.find({
            $or: [{ senderId: user1, receiverId: user2 }, { senderId: user2, receiverId: user1 }]
        }).sort({ timestamp: 1 });

        // ✅ Decrypt messages dynamically based on the recipient
        const decryptedMessages = messages.map(msg => {
            try {
                // Determine who the recipient is (they should decrypt the AES key)
                const recipient = msg.receiverId.toString() === user1 ? userOne : userTwo;

                if (!recipient.privateKey) {
                    console.error(`❌ Missing private key for recipient: ${recipient._id}`);
                    throw new Error("Recipient private key missing");
                }

                // console.log(`🔹 Using Private Key of User: ${recipient._id} for decryption`);

                // ✅ Decrypt AES key
                const aesKey = decryptAESKeyWithRSA(msg.aesKey, recipient.privateKey);
                // console.log(`✅ Decrypted AES Key: ${aesKey}`);

                // ✅ Decrypt message
                return {
                    sender: msg.senderId,
                    receiver: msg.receiverId,
                    message: decryptMessageAES(msg.encryptedMessage, aesKey),
                    timestamp: msg.timestamp
                };
            } catch (error) {
                console.error("❌ Error decrypting message:", error);
                return {
                    sender: msg.senderId,
                    receiver: msg.receiverId,
                    message: "🔒 Error decrypting message",
                    timestamp: msg.timestamp
                };
            }
        });

        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
