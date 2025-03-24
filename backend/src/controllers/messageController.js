const Message = require("../models/Message");
const User = require("../models/userModels");
const {
    generateAESKey,
    encryptMessageAES,
    decryptMessageAES,
    encryptAESKeyWithRSA,
    decryptAESKeyWithRSA
} = require("../utils/encryptionUtils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/**
 * Send a message (Patient ↔ Doctor)
 */
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        if (!senderId || !receiverId || !message.trim()) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const sender = await User.findById(senderId).select("privateKey");
        const receiver = await User.findById(receiverId).select("publicKey");

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        const aesKey = generateAESKey();
        const encryptedAESKey = encryptAESKeyWithRSA(aesKey, receiver.publicKey);
        const encryptedMessage = encryptMessageAES(message, aesKey);

        const newMessage = new Message({
            senderId,
            receiverId,
            encryptedMessage,
            aesKey: encryptedAESKey,
            read: false,
        });

        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

/**
 * Get Chat History (with decryption)
 */
exports.getChatHistory = async (req, res) => {
    try {
        const { user1, user2 } = req.body;

        const userOne = await User.findById(user1).select("privateKey");
        const userTwo = await User.findById(user2).select("privateKey");

        if (!userOne || !userTwo) {
            return res.status(400).json({ message: "One or both users not found" });
        }

        const messages = await Message.find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        }).sort({ timestamp: 1 });

        const decryptedMessages = messages.map(msg => {
            try {
                const recipient = msg.receiverId.toString() === user1 ? userOne : userTwo;

                const aesKey = decryptAESKeyWithRSA(msg.aesKey, recipient.privateKey);
                return {
                    sender: msg.senderId,
                    receiver: msg.receiverId,
                    message: decryptMessageAES(msg.encryptedMessage, aesKey),
                    read: msg.read,
                    timestamp: msg.timestamp
                };
            } catch (error) {
                return {
                    sender: msg.senderId,
                    receiver: msg.receiverId,
                    message: "🔒 Unable to decrypt message",
                    read: msg.read,
                    timestamp: msg.timestamp
                };
            }
        });

        await Message.updateMany(
            { receiverId: user1, read: false },
            { $set: { read: true } }
        );

        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Mark messages as read
 */
exports.markMessagesAsRead = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        await Message.updateMany(
            { senderId, receiverId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Doctor Chat List (with decrypted last messages)
 */
exports.getDoctorChatList = async (req, res) => {
    try {
        const doctorId = req.user.id;
        if (!doctorId) {
            return res.status(400).json({ error: "Doctor ID is required" });
        }

        const patients = await User.find({ doctorId }).select("_id username privateKey");
        if (!patients.length) {
            return res.status(200).json([]);
        }

        const patientIds = patients.map(p => p._id);

        const latestMessages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        {
                            senderId: new ObjectId(doctorId),
                            receiverId: { $in: patientIds.map(id => new ObjectId(id)) }
                        },
                        {
                            receiverId: new ObjectId(doctorId),
                            senderId: { $in: patientIds.map(id => new ObjectId(id)) }
                        }
                    ]
                }
            },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", new ObjectId(doctorId)] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$read", false] },
                                        { $eq: ["$receiverId", new ObjectId(doctorId)] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);
        
        const finalChats = await Promise.all(
            patients.map(async (patient) => {
                const chat = latestMessages.find(msg => msg._id.toString() === patient._id.toString());

                if (chat) {
                    try {
                        const doctorPrivateKey = patients.find(p => p._id.toString() === doctorId)?.privateKey;

                        if (!doctorPrivateKey) throw new Error("Doctor private key missing");

                        const decryptedAESKey = decryptAESKeyWithRSA(chat.lastMessage.aesKey, doctorPrivateKey);
                        const decryptedMessage = decryptMessageAES(chat.lastMessage.encryptedMessage, decryptedAESKey);

                        return {
                            patientId: patient._id,
                            patientName: patient.username,
                            lastMessage: decryptedMessage,
                            lastMessageTimestamp: chat.lastMessage.timestamp,
                            isLastMessageRead: chat.lastMessage.read,
                            unreadCount: chat.unreadCount
                        };
                    } catch (error) {
                        return {
                            patientId: patient._id,
                            patientName: patient.username,
                            lastMessage: "🔒 Unable to decrypt message",
                            lastMessageTimestamp: chat.lastMessage?.timestamp,
                            isLastMessageRead: chat.lastMessage?.read,
                            unreadCount: chat.unreadCount
                        };
                    }
                }

                // No messages found for this patient
                return {
                    patientId: patient._id,
                    patientName: patient.username,
                    lastMessage: null,
                    lastMessageTimestamp: null,
                    isLastMessageRead: null,
                    unreadCount: 0
                };
            })
        );

        // Final sort
        finalChats.sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));

        res.json(finalChats);
    } catch (error) {
        console.error("❌ Error fetching doctor chat list:", error);
        res.status(500).json({ error: "Server error fetching chat list." });
    }
};
