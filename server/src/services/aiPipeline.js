const { v4: uuidv4 } = require('uuid');

const PIPELINE_STAGES = [
  { key: 'scriptGeneration', label: 'Generating Script', duration: 2500 },
  { key: 'sceneBreakdown', label: 'Breaking into Scenes', duration: 1800 },
  { key: 'visualGeneration', label: 'Generating Visuals', duration: 4000 },
  { key: 'animationCreation', label: 'Creating Animations', duration: 3500 },
  { key: 'transitions', label: 'Adding Transitions', duration: 1500 },
  { key: 'subtitleGeneration', label: 'Generating Subtitles', duration: 1200 },
  { key: 'voiceoverGeneration', label: 'Generating Voiceover', duration: 3000 },
  { key: 'backgroundMusic', label: 'Adding Background Music', duration: 1500 },
  { key: 'soundEffects', label: 'Adding Sound Effects', duration: 1000 },
  { key: 'audioSync', label: 'Syncing Audio & Video', duration: 2000 },
];

function generateScript(prompt, settings) {
  const durationMap = { '30sec': 30, '1min': 60, '5min': 300, '10min': 600 };
  const secs = durationMap[settings.duration] || 60;
  const sceneCountMap = { '30sec': 5, '1min': 10, '5min': 15, '10min': 20 };
  const sceneCount = sceneCountMap[settings.duration] || 10;
  
  const hooks = [
    `Did you know that ${prompt.substring(0, 40)}...`,
    `The future of ${prompt.substring(0, 30)} is here.`,
    `Everything you need to know about ${prompt.substring(0, 25)}.`,
    `${prompt.substring(0, 35)} — the complete guide.`
  ];
  
  return {
    hook: hooks[Math.floor(Math.random() * hooks.length)],
    scenes: Array.from({ length: sceneCount }, (_, i) => {
      const visualDesc = generateVisualDescription(prompt, i);
      const cleanPrompt = encodeURIComponent(visualDesc + ", 4k, cinematic, detailed, masterwork");
      return {
        index: i,
        title: `Scene ${i + 1}`,
        script: generateSceneScript(prompt, i, sceneCount),
        visualDescription: visualDesc,
        duration: Math.floor(secs / sceneCount),
        imageUrl: `https://image.pollinations.ai/prompt/${cleanPrompt}?width=640&height=360&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`,
        animationStyle: settings.animationStyle || 'cinematic',
        transition: ['fade', 'slide', 'zoom', 'dissolve'][i % 4],
        subtitles: []
      };
    })
  };
}

function generateSceneScript(prompt, index, total) {
  const scripts = [
    `Welcome to this immersive journey about ${prompt}. In today's rapidly evolving world, understanding this topic has never been more important.`,
    `Let's explore the fascinating aspects of ${prompt}. Our research reveals groundbreaking insights that will transform how you see the world.`,
    `The impact of ${prompt} extends far beyond what most people realize. Here are the key factors you need to understand.`,
    `As we dive deeper into ${prompt}, we uncover layers of complexity and opportunity that can change your perspective entirely.`,
    `The latest developments in ${prompt} are reshaping entire industries. Here's what the experts are saying about the future.`,
    `Understanding ${prompt} gives you a competitive advantage. These proven strategies will help you stay ahead of the curve.`,
    `The data is clear — ${prompt} is revolutionizing how we approach modern challenges. Let's break down the numbers.`,
    `In conclusion, ${prompt} represents one of the most significant opportunities of our time. Take action now to be part of this transformation.`
  ];
  return scripts[index % scripts.length];
}

function generateVisualDescription(prompt, index) {
  const cleanPrompt = prompt.length > 150 ? prompt.substring(0, 150) + "..." : prompt;
  const angles = [
    `Cinematic wide establishing shot of ${cleanPrompt}, vibrant studio lighting, realistic details, highly stylized, masterwork`,
    `High-fidelity close-up shot capturing details of ${cleanPrompt}, dynamic focus, dramatic lighting, vivid colors, masterwork`,
    `Action motion-blur tracking shot showcasing ${cleanPrompt}, cinematic atmosphere, dramatic shadows, sharp details, masterwork`,
    `Symmetrical centered shot showing ${cleanPrompt}, colorful volumetric lighting, high contrast, clean details, masterwork`,
    `Low angle heroic shot focusing on ${cleanPrompt}, golden hour lighting, cinematic style, highly detailed, masterwork`,
    `Wide pan shot portraying ${cleanPrompt} in an expansive environment, modern color grade, realistic textures, masterwork`,
    `High-angle view of ${cleanPrompt}, artistic depth of field, detailed scenery, masterwork`,
    `Dynamic medium shot of ${cleanPrompt}, bokeh background, professional cinema lighting, rich contrast, masterwork`
  ];
  return angles[index % angles.length];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPipeline(videoId, prompt, settings, io, videoStore) {
  const totalStages = PIPELINE_STAGES.length;
  
  for (let i = 0; i < PIPELINE_STAGES.length; i++) {
    const stage = PIPELINE_STAGES[i];
    
    // Update stage to running
    io.to(`video-${videoId}`).emit('pipeline-update', {
      videoId,
      stage: stage.key,
      stageLabel: stage.label,
      stageIndex: i,
      totalStages,
      stageStatus: 'running',
      stageProgress: 0,
      overallProgress: Math.floor((i / totalStages) * 100)
    });
    
    // Simulate progress within stage
    const steps = 10;
    for (let step = 1; step <= steps; step++) {
      await sleep(stage.duration / steps);
      io.to(`video-${videoId}`).emit('pipeline-update', {
        videoId,
        stage: stage.key,
        stageLabel: stage.label,
        stageIndex: i,
        totalStages,
        stageStatus: 'running',
        stageProgress: step * 10,
        overallProgress: Math.floor(((i + step / steps) / totalStages) * 100)
      });
    }
    
    // Stage complete
    io.to(`video-${videoId}`).emit('pipeline-update', {
      videoId,
      stage: stage.key,
      stageLabel: stage.label,
      stageIndex: i,
      totalStages,
      stageStatus: 'completed',
      stageProgress: 100,
      overallProgress: Math.floor(((i + 1) / totalStages) * 100)
    });
  }
  
  // Generate final data
  const scriptData = generateScript(prompt, settings);
  
  const completedVideo = {
    _id: videoId,
    status: 'completed',
    progress: 100,
    script: scriptData.hook,
    scenes: scriptData.scenes,
    thumbnail: `https://picsum.photos/seed/${videoId}/640/360`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    aiExtras: {
      title: generateViralTitle(prompt),
      hashtags: generateHashtags(prompt),
      seoDescription: generateSEODescription(prompt),
    }
  };
  
  // Update in-memory store
  const existing = videoStore.find(v => v._id === videoId);
  if (existing) Object.assign(existing, completedVideo);
  
  io.to(`video-${videoId}`).emit('generation-complete', completedVideo);
  
  return completedVideo;
}

function generateViralTitle(prompt) {
  const titles = [
    `${prompt} Will Change Everything (Here's Why)`,
    `The Truth About ${prompt} Nobody Tells You`,
    `I Tried ${prompt} For 30 Days — Here's What Happened`,
    `${prompt}: The Complete 2025 Guide`,
    `Why ${prompt} Is Taking Over The Internet`,
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateHashtags(prompt) {
  const words = prompt.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 3);
  const base = ['#viral', '#trending', '#ai', '#video', '#content', '#youtube', '#shorts'];
  const custom = words.map(w => `#${w.replace(/[^a-z0-9]/g,'')}`).filter(Boolean);
  return [...custom, ...base].slice(0, 15);
}

function generateSEODescription(prompt) {
  return `Discover everything about ${prompt} in this comprehensive AI-generated video. We cover the latest trends, expert insights, and actionable strategies you can implement today. Perfect for anyone looking to understand ${prompt} better. Subscribe for more AI-powered content that helps you stay ahead of the curve. Like and share if you found this valuable! #AI #VideoContent #${prompt.split(' ')[0]}`;
}

module.exports = { runPipeline, PIPELINE_STAGES };
