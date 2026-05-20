const express = require('express');
const router = express.Router();

router.post('/title', (req, res) => {
  const { prompt = '' } = req.body;
  const titles = [
    `${prompt} Will Change Everything in 2025`,
    `The Ultimate Guide to ${prompt} (That Actually Works)`,
    `I Discovered the Secret to ${prompt} — Here's the Proof`,
    `Why Everyone Is Wrong About ${prompt}`,
    `${prompt}: What No One Is Talking About`,
    `How to Master ${prompt} in Just 7 Days`,
    `The Dark Side of ${prompt} Revealed`,
  ];
  const selected = Array.from({length: 5}, () => titles[Math.floor(Math.random() * titles.length)]);
  res.json({ titles: [...new Set(selected)].slice(0, 5) });
});

router.post('/hashtags', (req, res) => {
  const { prompt = '' } = req.body;
  const words = prompt.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 5);
  const platform = ['#viral', '#trending', '#fyp', '#youtube', '#shorts', '#reels', '#content', '#ai', '#video', '#2025', '#creator', '#socialmedia'];
  const custom = words.map(w => `#${w.replace(/[^a-z0-9]/g,'')}`);
  res.json({ hashtags: [...custom, ...platform].slice(0, 20) });
});

router.post('/description', (req, res) => {
  const { prompt = '', title = '' } = req.body;
  const desc = `🎬 ${title || prompt} — the ultimate breakdown you've been waiting for!\n\n` +
    `In this video, we dive deep into everything you need to know about ${prompt}. Whether you're a beginner or an expert, this content will transform your understanding and give you actionable insights you can use immediately.\n\n` +
    `⏱️ TIMESTAMPS:\n00:00 - Introduction\n00:30 - Key Concepts\n02:00 - Deep Dive Analysis\n04:00 - Expert Insights\n05:30 - Action Plan\n\n` +
    `🔥 KEY TAKEAWAYS:\n✅ Understand the fundamentals\n✅ Apply proven strategies\n✅ Stay ahead of the curve\n✅ Get real results\n\n` +
    `👇 SUBSCRIBE for more AI-powered content that keeps you ahead!\n\n#AI #VideoContent #${prompt.split(' ')[0]} #Trending #2025`;
  res.json({ description: desc });
});

router.post('/thumbnail', (req, res) => {
  const { prompt = '' } = req.body;
  const seed = Math.floor(Math.random() * 1000);
  res.json({
    thumbnails: [
      { id: 1, url: `https://picsum.photos/seed/${seed}/1280/720`, style: 'Cinematic' },
      { id: 2, url: `https://picsum.photos/seed/${seed+1}/1280/720`, style: 'Bold Text' },
      { id: 3, url: `https://picsum.photos/seed/${seed+2}/1280/720`, style: 'Minimalist' },
    ]
  });
});

module.exports = router;
