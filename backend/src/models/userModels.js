const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"], // E.164 format
    },
        username:{
        type:String,
        required:true,
        unique:false,
        trim: true, // Removes leading and trailing spaces
    },
    gender: { 
        type: String,
         enum: ["male", "female"] },
         password: {
            type: String,
            required: true,
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