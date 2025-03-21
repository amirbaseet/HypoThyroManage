const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Email format validation
    },
    username:{
        type:String,
        required:true,
        unique:false,
        trim: true, // Removes leading and trailing spaces
    },
    dateOfBirth: {
         type: Date,
         validate: {
            validator: function (value) {
                return value < new Date(); // Ensures date is not in the future
            },
            message: "Date of Birth cannot be in the future."},
          required: true 
        },
    gender: { 
        type: String,
         enum: ["male", "female"] },
    password:{
     type:String,
     required:true
    },
    role:{
        type:String,
        required:true,
        enum:["admin","doctor","patient"],default: 'patient',
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: null
         }, // Patient's assigned doctor
    publicKey:{// Store public key for asymmetric encryption
        type: String
    },
    privateKey:{// Store Private key for Asymmetric encryption
        type: String
    },
    pushToken: {
         type: String,
          default: null
         }, // 🔹 Store Expo Push Token
        },
{
    timestamps: true,
}
);
module.exports = mongoose.model("User",userSchema);