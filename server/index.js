require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./src/routes/auth');
const { router: videoRouter } = require('./src/routes/videos');
const generationRoutes = require('./src/routes/generation');
const exportRoutes = require('./src/routes/export');
const aiRoutes = require('./src/routes/ai');
const uploadRoutes = require('./src/routes/upload');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.set('io', io);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRouter);
app.use('/api/generation', generationRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('join-video', (videoId) => socket.join(`video-${videoId}`));
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const PORT = process.env.PORT || 5001;

function startServer() {
  server.listen(PORT, () => {
    console.log(`✅ VisionFlow AI server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is in use. Please free it and restart.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
}

// Try MongoDB, but start server regardless
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => {
    console.log('✅ MongoDB connected');
    startServer();
  })
  .catch((err) => {
    console.warn(`⚠️  MongoDB unavailable (${err.message}) — running in demo/in-memory mode`);
    startServer();
  });
