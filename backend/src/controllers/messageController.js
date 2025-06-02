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
const { ObjectId } = mongoose.Types;

/**
 * Send Message (Patient ↔ Doctor)
 */
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;

        if (!senderId || !receiverId || !message.trim()) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check that the authenticated user is the sender (avoid spoofing)
        if (authenticatedUserId !== senderId) {
            return res.status(403).json({ message: "Unauthorized: Sender ID does not match authenticated user" });
        }

        // Fetch sender and receiver with required fields
        const sender = await User.findById(senderId).select("privateKey role doctorId");
        const receiver = await User.findById(receiverId).select("publicKey role doctorId");

        if (!sender || !receiver) {
            console.error("❌ User not found: Sender or Receiver is missing");
            return res.status(404).json({ message: "User not found" });
        }

        // Validate doctor-patient relationship
        let isValidPair = false;
        if (sender.role === "doctor" && receiver.role === "patient" && receiver.doctorId?.toString() === sender._id.toString()) {
            isValidPair = true;
        } else if (sender.role === "patient" && receiver.role === "doctor" && sender.doctorId?.toString() === receiver._id.toString()) {
            isValidPair = true;
        }

        if (!isValidPair) {
            return res.status(403).json({ message: "Unauthorized: Can only send messages between doctor and assigned patient" });
        }

        // Encryption process
        const aesKey = generateAESKey();
        const encryptedAESKey = encryptAESKeyWithRSA(aesKey, receiver.publicKey);
        const encryptedMessage = encryptMessageAES(message, aesKey);

        const newMessage = new Message({
            senderId,
            receiverId,
            encryptedMessage,
            aesKey: encryptedAESKey,
            read: false
        });

        await newMessage.save();
        console.log("✅ Message saved successfully");

        res.status(201).json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("❌ Error sending message:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

/**
 * Get Chat History (Decrypt Messages)
 */
exports.getChatHistory = async (req, res) => {
    try {
        const { user1, user2 } = req.body;
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;

        if (!user1 || !user2) {
            return res.status(400).json({ message: "Missing user IDs" });
        }

        // Fetch user data: role + doctorId + privateKey
        const userOne = await User.findById(user1).select("privateKey role doctorId");
        const userTwo = await User.findById(user2).select("privateKey role doctorId");

        if (!userOne || !userTwo) {
            return res.status(400).json({ message: "One or both users not found" });
        }

        // Determine doctor and patient
        let doctor = null, patient = null;

        if (userOne.role === "doctor" && userTwo.role === "patient" && userTwo.doctorId?.toString() === userOne._id.toString()) {
            doctor = userOne; patient = userTwo;
        } else if (userTwo.role === "doctor" && userOne.role === "patient" && userOne.doctorId?.toString() === userTwo._id.toString()) {
            doctor = userTwo; patient = userOne;
        } else {
            return res.status(403).json({ message: "Invalid chat participants: must be between doctor and assigned patient" });
        }

        // 🛡️ Authorization: Check if authenticated user is part of this conversation
        if (authenticatedUserRole === "doctor" && authenticatedUserId !== doctor._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Doctor can only access their own patient chats" });
        }

        if (authenticatedUserRole === "patient" && authenticatedUserId !== patient._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Patient can only access their own chats" });
        }

        // Fetch messages
        const messages = await Message.find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        }).sort({ timestamp: 1 });

        const decryptedMessages = messages.map(msg => {
            try {
                const recipient = msg.receiverId.toString() === authenticatedUserId ? userOne : userTwo;

                if (!recipient.privateKey) {
                    console.error(`❌ Missing private key for recipient: ${recipient._id}`);
                    throw new Error("Recipient private key missing");
                }

                const aesKey = decryptAESKeyWithRSA(msg.aesKey, recipient.privateKey);

                return {
                    sender: msg.senderId,
                    receiver: msg.receiverId,
                    message: decryptMessageAES(msg.encryptedMessage, aesKey),
                    read: msg.read,
                    timestamp: msg.timestamp
                };
            } catch (error) {
                console.error("❌ Error decrypting message:", error);
                return {
                    sender: msg.senderId,
                    receiver: msg.receiverId,
                    message: "🔒 Error decrypting message",
                    read: msg.read,
                    timestamp: msg.timestamp
                };
            }
        });

        // Mark messages as read for the authenticated user
        await Message.updateMany(
            { receiverId: authenticatedUserId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Mark Messages as Read
 */
exports.markMessagesAsRead = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const authenticatedUserId = req.user.id;
        const authenticatedUserRole = req.user.role;

        if (!senderId || !receiverId) {
            return res.status(400).json({ message: "Missing sender or receiver ID" });
        }

        const sender = await User.findById(senderId).select("role doctorId");
        const receiver = await User.findById(receiverId).select("role doctorId");

        if (!sender || !receiver) {
            return res.status(404).json({ message: "Sender or receiver not found" });
        }

        // 🔒 Validate doctor-patient relationship
        let isValidPair = false;

        if (sender.role === "doctor" && receiver.role === "patient" && receiver.doctorId?.toString() === sender._id.toString()) {
            isValidPair = true;
        } else if (sender.role === "patient" && receiver.role === "doctor" && sender.doctorId?.toString() === receiver._id.toString()) {
            isValidPair = true;
        }

        if (!isValidPair) {
            return res.status(403).json({ message: "Unauthorized: Can only mark messages in doctor-patient chats" });
        }

        // 🔒 Enforce role-specific access:
        if (authenticatedUserRole === "doctor") {
            if (authenticatedUserId !== receiver._id.toString() && authenticatedUserId !== sender._id.toString()) {
                return res.status(403).json({ message: "Unauthorized: Doctor can only mark messages for their own patients" });
            }
        } else if (authenticatedUserRole === "patient") {
            if (authenticatedUserId !== receiver._id.toString()) {
                return res.status(403).json({ message: "Unauthorized: Patient can only mark their own received messages" });
            }
        } else {
            return res.status(403).json({ message: "Unauthorized: Invalid role" });
        }

        // ✅ Update messages
        const result = await Message.updateMany(
            { senderId, receiverId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ message: "Messages marked as read", modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error("❌ Error marking messages as read:", error);
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
                        { senderId: new ObjectId(doctorId), receiverId: { $in: patientIds.map(id => new ObjectId(id)) } },
                        { receiverId: new ObjectId(doctorId), senderId: { $in: patientIds.map(id => new ObjectId(id)) } }
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
                        const doctorPrivateKey = (await User.findById(doctorId).select("privateKey")).privateKey;

                        if (!doctorPrivateKey) throw new Error("Doctor private key missing");

                         // const decryptedAESKey = decryptAESKeyWithRSA(chat.lastMessage.aesKey, doctorPrivateKey);
                        // const decryptedMessage = decryptMessageAES(chat.lastMessage.encryptedMessage, decryptedAESKey);

                        return {
                            patientId: patient._id,
                            patientName: patient.username,
                            lastMessage: "Message",
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

        finalChats.sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));

        res.json(finalChats);
    } catch (error) {
        console.error("❌ Error fetching doctor chat list:", error);
        res.status(500).json({ error: "Server error fetching chat list." });
    }
};

/**
 * Get Unread Message Count for Patient
 * GET /messages/unread-count?userId=...
 */
exports.getPatientUnreadMessageCount = async (req, res) => {
    try {
        const { userId } = req.query;
        const count = await Message.countDocuments({ receiverId: userId, read: false });
        res.json(count);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching unread count' });
    }
};
