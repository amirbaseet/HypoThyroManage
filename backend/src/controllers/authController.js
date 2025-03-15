const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const NodeRSA = require("node-rsa");
const { generateRSAKeys } = require("../utils/encryptionUtils");



const register = async (req, res) => {
   try {
    
       const { email, username, password, dateOfBirth, gender, role, adminKey } = req.body;

       //Prevent normal Users from Creating an admin
       if (role === "admin") {
        if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {
            return res.status(403).json({ message: "Unauthorized to create an admin account" });
        }
    }
   
       //checking if the email is exist
        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"Email is already taken"});
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
        const newUser = new User({ email,username, password: hashedPass, dateOfBirth, gender, role, doctorId, publicKey, privateKey  });
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
        const { email, password } = req.body;
        console.log(req.body);
        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: `User with email ${email} not found` });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username,doctorId: user.doctorId, dateOfBirth: user.dateOfBirth, gender: user.gender ,role: user.role },
            process.env.JWT_SEC, 
            { expiresIn: "1h" }
        );

        res.status(200).json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};
module.exports = { register, login };
