const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

let Video;
try { Video = require('../models/Video'); } catch {}

const useDb = () => Video && mongoose.connection.readyState === 1;

// In-memory store fallback
const inMemoryVideos = [];

router.get('/', async (req, res) => {
  try {
    if (useDb()) {
      const videos = await Video.find({}).sort({ createdAt: -1 }).limit(50);
      return res.json(videos);
    }
    res.json(inMemoryVideos.slice().reverse());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (useDb()) {
      const video = await Video.findById(req.params.id);
      if (!video) return res.status(404).json({ message: 'Not found' });
      return res.json(video);
    }
    const video = inMemoryVideos.find(v => v._id === req.params.id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (useDb()) {
      await Video.findByIdAndDelete(req.params.id);
    } else {
      const i = inMemoryVideos.findIndex(v => v._id === req.params.id);
      if (i !== -1) inMemoryVideos.splice(i, 1);
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    if (useDb()) {
      const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(video);
    }
    const video = inMemoryVideos.find(v => v._id === req.params.id);
    if (video) Object.assign(video, req.body);
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router, inMemoryVideos };
