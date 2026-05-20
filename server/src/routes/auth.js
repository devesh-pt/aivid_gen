const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const mongoose = require('mongoose');

let User;
try { User = require('../models/User'); } catch {}

const useDb = () => User && mongoose.connection.readyState === 1;

const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Demo users (in-memory fallback when no MongoDB)
const demoUsers = [
  { _id: 'demo123', name: 'Demo User', email: 'demo@aivid-gen.ai', password: 'demo1234', plan: 'pro', videosGenerated: 12, storageUsed: 2.4 }
];

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (useDb()) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already registered' });
      const user = await User.create({ name, email, password });
      const token = generateToken(user._id);
      res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, plan: user.plan } });
    } else {
      const user = { _id: Date.now().toString(), name, email, plan: 'free', videosGenerated: 0, storageUsed: 0 };
      const token = generateToken(user._id);
      res.status(201).json({ token, user });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (useDb()) {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ message: 'Invalid credentials' });
      const token = generateToken(user._id);
      res.json({ token, user: { _id: user._id, name: user.name, email: user.email, plan: user.plan, videosGenerated: user.videosGenerated } });
    } else {
      // Demo mode
      const demo = demoUsers.find(u => u.email === email);
      if (!demo || password !== demo.password) return res.status(401).json({ message: 'Invalid credentials' });
      const token = generateToken(demo._id);
      res.json({ token, user: { _id: demo._id, name: demo.name, email: demo.email, plan: demo.plan, videosGenerated: demo.videosGenerated } });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (useDb()) {
      const user = await User.findById(decoded.userId).select('-password');
      res.json(user);
    } else {
      res.json({ _id: decoded.userId, name: 'Demo User', email: 'demo@aivid-gen.ai', plan: 'pro', videosGenerated: 12 });
    }
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
