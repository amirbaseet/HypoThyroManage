const express = require('express');
const router = express.Router();
const { getVideoUrl } = require('../controllers/videoController');

/**
 * @swagger
 * tags:
 *   name: Videos
 *   description: Video-related endpoints (e.g., get video by type)
 */

/**
 * @swagger
 * /api/videos/get-video-url:
 *   get:
 *     summary: Get video URL by type
 *     tags: [Videos]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: true
 *         description: Type of the video (e.g., stress, Nutrition, Brain)
 *     responses:
 *       200:
 *         description: Video URL found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "https://www.dropbox.com/scl/fi/lyxqltxo801jrax30xwa5/T_Stres-Y-netimi.mp4"
 *       400:
 *         description: Missing type parameter
 *       404:
 *         description: Video not found
 */
router.get('/get-video-url', getVideoUrl);

module.exports = router;
