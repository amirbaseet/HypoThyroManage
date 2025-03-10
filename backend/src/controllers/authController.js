const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const register = async (req, res) => {
   try {
       const { email,username, password, role } = req.body;
        //checking if the email is exist

        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"Email is already taken"});
        }
       // Hash password
       const hashedPass = await bcrypt.hash(password, 10);

       // Create a new user
       const newUser = new User({ email,username, password: hashedPass, role });

       // Save the user to the database
       await newUser.save();

       res.status(201).json({ message: `User registered with username ${username}` });
   } catch (err) {
       console.error(err);
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
            { id: user._id, username: user.username,role: user.role },
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
