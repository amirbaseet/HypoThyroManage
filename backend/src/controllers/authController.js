/**
 * Authentication Controller
 * 
 * Handles user registration, login, logout, token management, push token updates, and password resets.
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
// const NodeRSA = require("node-rsa");
const { generateRSAKeys } = require("../utils/encryptionUtils");

const { sendPushNotification  } = require("../utils/notificationService");
/**
 * Register a new user (admin/doctor/patient)
 * 
 * @route POST /api/auth/register
 * @param {string} phoneNumber
 * @param {string} username
 * @param {string} password - Must be exactly 6 digits
 * @param {string} gender
 * @param {string} role - Must be "admin", "doctor", or "patient"
 * @param {string} [adminKey] - Required for admin account creation
 */

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
       console.log(`new user registered as ${role} with userName =${username}`)
    } catch (err) {
       console.error(" Error registering user:",err);
       res.status(500).json({ message: "Something went wrong" });
   }
};
/**
 * Login a user and generate JWT token
 * 
 * @route POST /api/auth/login
 * @param {string} phoneNumber
 * @param {string} password
 */
const login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        // console.log(req.body);

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
            { expiresIn: "1y" }
        );
        // refresh Token
        // const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SEC, { expiresIn: "2y" });

        // // Save refreshToken to user
        // user.refreshToken = refreshToken;
        // await user.save();

        
        // 🔹 Send login notification
        await sendPushNotification(user._id, "Welcome Back!", `Hello ${user.username}, you are now logged in!`);
        // res.status(200).json({ token, refreshToken  });
        console.log(`${user.username} Logged in UserId = ${user._id}`);

        res.status(200).json({ token});

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};
/**
 * Update user's push token (for notifications)
 * 
 * @route POST /api/auth/push-token
 * @param {string} userId
 * @param {string} pushToken
 */
const updatePushToken  = async (req, res) =>{
   
    try{

        const { userId, pushToken} =req.body;

        if(!userId || !pushToken){
            return res.status(400).json({ message: "User ID and Push Token are required" });
        } 
        console.log("Updated")
        await User.findByIdAndUpdate(userId, { pushToken });
        res.status(200).json({ message: "Push token updated successfully" });
    }catch(error){
        console.error("Error updating push token:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
/**
 * Remove user's push token (on logout)
 * 
 * @route POST /api/auth/remove-push-token
 * @param {string} userId
 */
const removePushToken = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("user Logged Out userId",userId)
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // // ✅ Remove the push token from the database
        // await User.findByIdAndUpdate(userId, { $unset: { pushToken: 1 } });

        return res.status(200).json({ message: "Push token removed successfully" });
    } catch (error) {
        console.error("❌ Error removing push token:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
/**
 * Refresh JWT access token (using refresh token)
 * 
 * @route POST /api/auth/refresh-token
 * @param {string} refreshToken
 */
const refreshTokenHandler = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SEC);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            {
                id: user._id,
                phoneNumber: user.phoneNumber,
                username: user.username,
                doctorId: user.doctorId,
                gender: user.gender,
                role: user.role
            },
            process.env.JWT_SEC,
            { expiresIn: "1min" }
        );

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error("Error verifying refresh token:", err);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};
/**
 * Logout the user (clear refresh token)
 * 
 * @route POST /api/auth/logout
 */
const logout = async (req, res) => {
    try {
        const userId = req.user.id;
        await User.findByIdAndUpdate(userId, { refreshToken: null });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Logout failed" });
    }
};
/**
 * Reset user's password
 * 
 * @route POST /api/auth/reset-password
 * @param {string} phoneNumber
 * @param {string} newPassword - Must be exactly 6 digits
 */
const resetUserPassword = async (req, res) => {
    try {
      const { phoneNumber, newPassword } = req.body; // 🛠 fixed name
  
      // Validate new password (must be exactly 6 digits)
      if (!/^\d{6}$/.test(newPassword)) {
        return res.status(400).json({ message: "Password must be exactly 6 digits" });
      }
  
      const targetUser = await User.findOne({ phoneNumber });
  
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const hashedPass = await bcrypt.hash(newPassword, 10);
  
      targetUser.password = hashedPass;
      await targetUser.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password", error);
      res.status(500).json({ message: "Internal server error" }); // 🛠 fixed res.status.json → res.status(500).json
    }
  };
  
module.exports = { register, resetUserPassword, login, logout, updatePushToken, refreshTokenHandler, removePushToken };
