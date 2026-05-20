const express = require('express');
const router = express.Router();
const { inMemoryVideos } = require('./videos');

let Video;
try { Video = require('../models/Video'); } catch {}

router.post('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quality = '1080p', watermark = false, compression = 'medium' } = req.body;
    
    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const downloadUrl = `https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4`;
    const fileSize = quality === '4K' ? 485.2 : quality === '1080p' ? 142.7 : 48.3;
    
    if (Video) {
      await Video.findByIdAndUpdate(id, { downloadUrl, fileSize, status: 'exported' });
    } else {
      const v = inMemoryVideos.find(v => v._id === id);
      if (v) { v.downloadUrl = downloadUrl; v.fileSize = fileSize; v.status = 'exported'; }
    }
    
    res.json({
      success: true,
      downloadUrl,
      fileSize: `${fileSize} MB`,
      format: 'MP4',
      quality,
      watermark,
      compression
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
