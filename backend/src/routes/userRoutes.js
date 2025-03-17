const express = require("express");
const verifyToken = require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")
const router = express.Router();
const User = require("../models/userModels");


router.get("/admin",verifyToken,authorizeRoles("admin"),(req,res)=>{ 
    res.json({message:"Welcome Admin"});
});

router.get("/manager",verifyToken,authorizeRoles("admin","manager"),(req,res)=>{ 
    res.json({message:"Welcome manager"});
});

router.get("/user",verifyToken,authorizeRoles("admin","manager","user"),(req,res)=>{ 
    res.json({message:"Welcome user"});
});


// ✅ Get public key of a user by ID
router.get("/publicKey/:userId", verifyToken, async (req, res) => { 
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.publicKey) return res.status(400).json({ error: "User has no public key" });

        res.json({ publicKey: user.publicKey });
    } catch (error) {
        console.error("Error fetching public key:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;