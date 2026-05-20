const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { runPipeline } = require('../services/aiPipeline');

let Video;
try { Video = require('../models/Video'); } catch {}

const { inMemoryVideos } = require('./videos');

router.post('/start', async (req, res) => {
  try {
    const { prompt, settings = {} } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });
    
    const io = req.app.get('io');
    const videoId = uuidv4();
    
    const videoData = {
      _id: videoId,
      prompt,
      title: prompt.substring(0, 60) + '...',
      status: 'generating',
      progress: 0,
      settings: {
        resolution: settings.resolution || '1080p',
        aspectRatio: settings.aspectRatio || '16:9',
        duration: settings.duration || '1min',
        voice: settings.voice || 'female',
        animationStyle: settings.animationStyle || 'cinematic',
        subtitleStyle: settings.subtitleStyle || 'modern',
        backgroundMusic: settings.backgroundMusic || 'ambient',
        watermark: settings.watermark !== false
      },
      scenes: [],
      createdAt: new Date()
    };
    
    if (Video) {
      const dbVideo = await Video.create({ ...videoData, userId: null });
      videoData._id = dbVideo._id.toString();
    } else {
      inMemoryVideos.push(videoData);
    }
    
    res.status(201).json({ videoId: videoData._id, status: 'generating' });
    
    // Run pipeline async
    runPipeline(videoData._id, prompt, videoData.settings, io, inMemoryVideos)
      .catch(err => {
        console.error('Pipeline error:', err);
        io.to(`video-${videoData._id}`).emit('generation-error', { videoId: videoData._id, error: err.message });
      });
      
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/status/:videoId', (req, res) => {
  const { videoId } = req.params;
  if (Video) {
    Video.findById(videoId)
      .then(v => res.json(v || { status: 'not_found' }))
      .catch(() => res.json({ status: 'error' }));
  } else {
    const v = inMemoryVideos.find(v => v._id === videoId);
    res.json(v || { status: 'not_found' });
  }
});

module.exports = router;
