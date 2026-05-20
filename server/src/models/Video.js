const mongoose = require('mongoose');

const sceneSchema = new mongoose.Schema({
  index: Number,
  title: String,
  script: String,
  visualDescription: String,
  duration: Number,
  imageUrl: String,
  animationStyle: String,
  transition: String,
  subtitles: [{ startTime: Number, endTime: Number, text: String }]
});

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, default: 'Untitled Video' },
  prompt: { type: String, required: true },
  status: {
    type: String,
    enum: ['queued', 'generating', 'completed', 'failed', 'exported'],
    default: 'queued'
  },
  settings: {
    resolution: { type: String, default: '1080p' },
    aspectRatio: { type: String, default: '16:9' },
    duration: { type: String, default: '1min' },
    durationSeconds: { type: Number, default: 60 },
    voice: { type: String, default: 'female' },
    animationStyle: { type: String, default: 'cinematic' },
    subtitleStyle: { type: String, default: 'modern' },
    backgroundMusic: { type: String, default: 'ambient' },
    watermark: { type: Boolean, default: true }
  },
  pipeline: {
    scriptGeneration: { status: String, progress: Number },
    sceneBreakdown: { status: String, progress: Number },
    visualGeneration: { status: String, progress: Number },
    animationCreation: { status: String, progress: Number },
    transitions: { status: String, progress: Number },
    subtitleGeneration: { status: String, progress: Number },
    voiceoverGeneration: { status: String, progress: Number },
    backgroundMusic: { status: String, progress: Number },
    soundEffects: { status: String, progress: Number },
    audioSync: { status: String, progress: Number }
  },
  scenes: [sceneSchema],
  script: String,
  thumbnail: String,
  videoUrl: String,
  downloadUrl: String,
  aiExtras: {
    title: String,
    hashtags: [String],
    seoDescription: String,
    thumbnailUrl: String
  },
  progress: { type: Number, default: 0 },
  generationTime: Number,
  fileSize: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

videoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Video', videoSchema);
