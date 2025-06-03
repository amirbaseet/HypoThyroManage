/**
 * Video Controller
 * 
 * Provides URLs for educational videos based on requested topic type.
 * Videos are stored on Dropbox and mapped to specific health topics.
 */
const videoMapping = {
  'stress': 'https://www.dropbox.com/scl/fi/lyxqltxo801jrax30xwa5/T_Stres-Y-netimi.mp4?rlkey=zcpsnk6krybaycx25f6h9stgm&st=rx8njnh1&raw=1',
  'Nutrition': 'https://www.dropbox.com/scl/fi/31ll7851g5bbtwndkx9br/T_Beslenme.mp4?rlkey=hiqyg3wk52lp8d1xvxczbr7e2&st=3ia8t4y6&raw=1',
  'Dermatological': 'https://www.dropbox.com/scl/fi/csom4ywrskot28o991gj6/T_Dermatolojik.mp4?rlkey=1wj1h63r6do4o079vpb1t3qgf&st=bxwnhsgf&raw=1',
  'Brain': 'https://www.dropbox.com/scl/fi/c659dc3nuhjs2tk8h4y1b/T_Beyin-Egzersizi.mp4?rlkey=008k96ngh9t3ff5yk8mmkwaap&st=nm6idc2p&raw=1',
  'Exercise': 'https://www.dropbox.com/scl/fi/506523qtddc8s04xaaz4b/T_Egzersiz.mp4?rlkey=gc7wzk0zlwpswhmzf94mjzubo&st=uc0mw4ux&raw=1',
};
/**
 * Get video URL by type.
 * 
 * Expects a `type` query parameter that matches a key in the `videoMapping` object.
 * 
 * @param {Object} req - Express request object.
 *   @param {string} req.query.type - The video topic (e.g., 'stress', 'Nutrition').
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} JSON response containing:
 *   - {string|null} url: The Dropbox URL for the video if found, or null.
 * 
 * @example
 * // GET /api/videos?type=stress
 * Response:
 * { "url": "https://www.dropbox.com/..." }
 */
const getVideoUrl = (req, res) => {
  const { type } = req.query;
  if (!type) {
    return res.status(400).json({ error: 'Missing type parameter' });
  }

  const videoUrl = videoMapping[type];
  if (!videoUrl) {
    return res.json({ url: null });
  }

  return res.json({ url: videoUrl });
};

module.exports = { getVideoUrl };
