const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
// const NodeRSA = require("node-rsa");
const { generateRSAKeys } = require("../utils/encryptionUtils");

const { sendPushNotification  } = require("../utils/notificationService");

const register = async (req, res) => {
   try {
    
    const { phoneNumber, username, password, gender, role, adminKey } = req.body;

    if (!/^\d{6}$/.test(password)) {
        return res.status(400).json({ message: "Password must be exactly 6 digits" });
    }
    
       //Prevent normal Users from Creating an admin
       if (role === "admin") {
        if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ message: "Unauthorized to create an admin account" });
        }
    }
   
       //checking if the email is exist
       const existUser = await User.findOne({ phoneNumber });
       if (existUser) {
           return res.status(400).json({ message: "Phone number is already taken" });
       }

        if(!["admin","doctor","patient"].includes(role)){
            return res.status(400).json({ message: "Invalid role. Must be 'admin', 'doctor', or 'patient'." });
        }

        let doctorId = null;

        //Auto-assign a doctor if the user is a patient
        if(role === "patient"){
            const doctor = await User.findOne({role: "doctor"})//Find any doctor
            .sort({patientCount: 1});// get the doctor with the fewest patients
      
            doctorId = doctor._id;
            await User.findByIdAndUpdate(doctorId, { $inc: {patientCount: 1}});
        }


       // Hash password
       const hashedPass = await bcrypt.hash(password, 10);
       const { publicKey, privateKey } = generateRSAKeys();

        // Create a new user
        const newUser = new User({
            phoneNumber,
            username,
            password: hashedPass,
            gender,
            role,
            doctorId,
            publicKey,
            privateKey
        });
        // console.log("privateKey",privateKey)
       // Save the user to the database
       await newUser.save();
        // console.log("NewUser", newUser)
       res.status(201).json({ message: `User registered as ${role}`});
    } catch (err) {
       console.error(" Error registering user:",err);
       res.status(500).json({ message: "Something went wrong" });
   }
};

const login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        console.log(req.body);
        // Check if user exists
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            return res.status(404).json({ message: `User with phone number ${phoneNumber} not found` });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, phoneNumber: user.phoneNumber, username: user.username,doctorId: user.doctorId, gender: user.gender ,role: user.role },
            process.env.JWT_SEC, 
            { expiresIn: "1d" }
        );
        // 🔹 Send login notification
        await sendPushNotification(user._id, "Welcome Back!", `Hello ${user.username}, you are now logged in!`);
        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updatePushToken  = async (req, res) =>{
   
    try{

        const { userId, pushToken} =req.body;

        if(!userId || !pushToken){
            return res.status(400).json({ message: "User ID and Push Token are required" });
        } 
        await User.findByIdAndUpdate(userId, { pushToken });
        res.status(200).json({ message: "Push token updated successfully" });
    }catch(error){
        console.error("Error updating push token:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const removePushToken = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // ✅ Remove the push token from the database
        await User.findByIdAndUpdate(userId, { $unset: { pushToken: 1 } });

        return res.status(200).json({ message: "Push token removed successfully" });
    } catch (error) {
        console.error("❌ Error removing push token:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { register, login, updatePushToken, removePushToken };
