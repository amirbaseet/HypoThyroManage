const Message = require("../models/Message");
const User = require("../models/userModels");
const { generateAESKey, encryptMessageAES, decryptMessageAES, encryptAESKeyWithRSA, decryptAESKeyWithRSA } = require("../utils/encryptionUtils");

/**
 *  Send Message (Patient ↔ Doctor)
 */
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        if (!senderId || !receiverId || !message.trim()) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // console.log("🔹 Sending Message:", { senderId, receiverId, message });

        const sender = await User.findById(senderId).select("privateKey");
        const receiver = await User.findById(receiverId).select("publicKey");

        if (!sender || !receiver) {
            console.error("❌ User not found: Sender or Receiver is missing");
            console.error("❌ User not found: Sender or Receiver is missing");
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
            aesKey: encryptedAESKey,
            read: false,
        });

        await newMessage.save();
        console.log("✅ Message saved successfully");
        console.log("✅ Message saved successfully");

        res.status(201).json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
        console.error("❌ Error sending message:", error); // 👈 Check the full error log
        res.status(500).json({ message: "Internal Server Error", error: error.message });
        console.error("❌ Error sending message:", error); // 👈 Check the full error log
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

/**
 * Get Chat History (Decrypt Messages)
 * and make the messages being read 
 * and make the messages being read 
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
                    read: msg.read,
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
                    read: msg.read,
                    timestamp: msg.timestamp
                };
            }
        });

        await Message.updateMany(
            { receiverId: user1, read:false },
            { $set: { read:true }}
        );

        await Message.updateMany(
            { receiverId: user1, read:false },
            { $set: { read:true }}
        );

        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
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



exports.getDoctorChatList = async (req, res) => {
    try {
        const doctorId = req.user.id; // Get authenticated doctor's ID

        if (!doctorId) {
            return res.status(400).json({ error: "Doctor ID is required" });
        }

        console.log("🔹 Fetching patients assigned to Doctor ID:", doctorId);

        // ✅ Step 1: Find all patients assigned to this doctor
        const patients = await User.find({ doctorId }).select("_id username privateKey");

        if (patients.length === 0) {
            console.log("⚠ No patients found for this doctor.");
            return res.status(200).json({ message: "No assigned patients found", chats: [] });
        }

        const patientIds = patients.map(patient => patient._id);
        console.log(`✅ Found ${patients.length} patients assigned to the doctor.`);

        // ✅ Step 2: Fetch the latest message per patient and unread messages count
        const latestMessages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: doctorId, receiverId: { $in: patientIds } },
                        { receiverId: doctorId, senderId: { $in: patientIds } }
                    ]
                }
            },
            { $sort: { timestamp: -1 } }, // Sort messages by latest timestamp
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", doctorId] }, "$receiverId", "$senderId"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }, // Get latest message
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$read", false] }, { $eq: ["$receiverId", doctorId] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "patientDetails"
                }
            },
            { $unwind: "$patientDetails" },
            {
                $project: {
                    _id: 0,
                    patientId: "$patientDetails._id",
                    patientName: "$patientDetails.username",
                    lastMessageEncrypted: "$lastMessage.encryptedMessage",
                    lastMessageAESKey: "$lastMessage.aesKey",
                    lastMessageSenderId: "$lastMessage.senderId",
                    lastMessageReceiverId: "$lastMessage.receiverId",
                    lastMessageTimestamp: "$lastMessage.timestamp",
                    isLastMessageRead: "$lastMessage.read",
                    unreadCount: 1
                }
            },
            { $sort: { lastMessageTimestamp: -1 } }
        ]);

        // ✅ Step 3: Decrypt last messages for the doctor
        const patientChats = patients.map(patient => {
            const chat = latestMessages.find(msg => msg.patientId.toString() === patient._id.toString());

            if (chat) {
                try {
                    const doctorPrivateKey = patients.find(p => p._id.toString() === doctorId)?.privateKey;

                    if (!doctorPrivateKey) {
                        console.error("❌ Doctor private key missing");
                        throw new Error("Doctor private key missing");
                    }

                    // Decrypt AES key using the doctor's private key
                    const decryptedAESKey = decryptAESKeyWithRSA(chat.lastMessageAESKey, doctorPrivateKey);

                    // Decrypt the last message
                    chat.lastMessage = decryptMessageAES(chat.lastMessageEncrypted, decryptedAESKey);

                    delete chat.lastMessageEncrypted; // Remove encrypted text
                    delete chat.lastMessageAESKey; // Remove AES key
                } catch (error) {
                    console.error("❌ Error decrypting last message:", error);
                    chat.lastMessage = "🔒 Unable to decrypt message";
                }
            }

            return chat || {
                patientId: patient._id,
                patientName: patient.username,
                lastMessage: null,
                lastMessageTimestamp: null,
                isLastMessageRead: null,
                unreadCount: 0
            };
        });

        console.log(`✅ Retrieved ${patientChats.length} chat(s) for this doctor.`);
        res.json(patientChats);
    } catch (error) {
        console.error("❌ Error fetching doctor chat list:", error);
        res.status(500).json({ error: "Server error fetching chat list." });
    }
};

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



exports.getDoctorChatList = async (req, res) => {
    try {
        const doctorId = req.user.id; // Get authenticated doctor's ID

        if (!doctorId) {
            return res.status(400).json({ error: "Doctor ID is required" });
        }

        console.log("🔹 Fetching patients assigned to Doctor ID:", doctorId);

        // ✅ Step 1: Find all patients assigned to this doctor
        const patients = await User.find({ doctorId }).select("_id username privateKey");

        if (patients.length === 0) {
            console.log("⚠ No patients found for this doctor.");
            return res.status(200).json({ message: "No assigned patients found", chats: [] });
        }

        const patientIds = patients.map(patient => patient._id);
        console.log(`✅ Found ${patients.length} patients assigned to the doctor.`);

        // ✅ Step 2: Fetch the latest message per patient and unread messages count
        const latestMessages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: doctorId, receiverId: { $in: patientIds } },
                        { receiverId: doctorId, senderId: { $in: patientIds } }
                    ]
                }
            },
            { $sort: { timestamp: -1 } }, // Sort messages by latest timestamp
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", doctorId] }, "$receiverId", "$senderId"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }, // Get latest message
                    unreadCount: {
                        $sum: {
                            $cond: [
                                { $and: [{ $eq: ["$read", false] }, { $eq: ["$receiverId", doctorId] }] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "patientDetails"
                }
            },
            { $unwind: "$patientDetails" },
            {
                $project: {
                    _id: 0,
                    patientId: "$patientDetails._id",
                    patientName: "$patientDetails.username",
                    lastMessageEncrypted: "$lastMessage.encryptedMessage",
                    lastMessageAESKey: "$lastMessage.aesKey",
                    lastMessageSenderId: "$lastMessage.senderId",
                    lastMessageReceiverId: "$lastMessage.receiverId",
                    lastMessageTimestamp: "$lastMessage.timestamp",
                    isLastMessageRead: "$lastMessage.read",
                    unreadCount: 1
                }
            },
            { $sort: { lastMessageTimestamp: -1 } }
        ]);

        // ✅ Step 3: Decrypt last messages for the doctor
        const patientChats = patients.map(patient => {
            const chat = latestMessages.find(msg => msg.patientId.toString() === patient._id.toString());

            if (chat) {
                try {
                    const doctorPrivateKey = patients.find(p => p._id.toString() === doctorId)?.privateKey;

                    if (!doctorPrivateKey) {
                        console.error("❌ Doctor private key missing");
                        throw new Error("Doctor private key missing");
                    }

                    // Decrypt AES key using the doctor's private key
                    const decryptedAESKey = decryptAESKeyWithRSA(chat.lastMessageAESKey, doctorPrivateKey);

                    // Decrypt the last message
                    chat.lastMessage = decryptMessageAES(chat.lastMessageEncrypted, decryptedAESKey);

                    delete chat.lastMessageEncrypted; // Remove encrypted text
                    delete chat.lastMessageAESKey; // Remove AES key
                } catch (error) {
                    console.error("❌ Error decrypting last message:", error);
                    chat.lastMessage = "🔒 Unable to decrypt message";
                }
            }

            return chat || {
                patientId: patient._id,
                patientName: patient.username,
                lastMessage: null,
                lastMessageTimestamp: null,
                isLastMessageRead: null,
                unreadCount: 0
            };
        });

        console.log(`✅ Retrieved ${patientChats.length} chat(s) for this doctor.`);
        res.json(patientChats);
    } catch (error) {
        console.error("❌ Error fetching doctor chat list:", error);
        res.status(500).json({ error: "Server error fetching chat list." });
    }
};

