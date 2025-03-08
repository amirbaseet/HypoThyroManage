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
    password:{
     type:String,
     required:true
    },
    role:{
        type:String,
        required:true,
        enum:["admin","doc","user"],
    },
    
},
{
    timestamps: true,
}
);
module.exports = mongoose.model("User",userSchema);