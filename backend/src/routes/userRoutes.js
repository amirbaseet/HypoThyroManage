const express = require("express");
const verifyToken = require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")
const router = express.Router();
const User = require("../models/userModels");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User utilities and access control endpoints
 */

/**
 * @swagger
 * /api/users/admin:
 *   get:
 *     summary: Access admin-only route
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for admin
 *       403:
 *         description: Access denied
 */

router.get("/admin",verifyToken,authorizeRoles("admin"),(req,res)=>{ 
    res.json({message:"Welcome Admin"});
});
/**
 * @swagger
 * /api/users/manager:
 *   get:
 *     summary: Access manager-only route
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for manager
 *       403:
 *         description: Access denied
 */
router.get("/manager",verifyToken,authorizeRoles("admin","manager"),(req,res)=>{ 
    res.json({message:"Welcome manager"});
});
/**
 * @swagger
 * /api/users/user:
 *   get:
 *     summary: Access user-level route (admin, manager, or user)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message for user
 *       403:
 *         description: Access denied
 */
router.get("/user",verifyToken,authorizeRoles("admin","manager","user"),(req,res)=>{ 
    res.json({message:"Welcome user"});
});

/**
 * @swagger
 * /api/users/publicKey/{userId}:
 *   get:
 *     summary: Get the public key of a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User's public key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 publicKey:
 *                   type: string
 *       400:
 *         description: User has no public key
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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