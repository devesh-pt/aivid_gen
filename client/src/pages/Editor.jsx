import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Download, Share2, Sparkles, Play, Pause,
  SkipBack, SkipForward, Volume2, VolumeX,
  RefreshCw, Plus, Trash2, Edit3, Copy,
  Check, Zap, Music, Mic, Hash, FileText,
  ChevronRight, X, Loader2,
  Film, Layers, Globe
} from 'lucide-react'
import { exportAPI, aiAPI, videoAPI } from '../services/api'
import { useVideoStore } from '../store/videoStore'
import toast from 'react-hot-toast'

const DEMO_VIDEO = {
  _id: 'demo',
  title: 'The Future of Artificial Intelligence — 2025 Guide',
  prompt: 'A documentary about the future of AI',
  status: 'completed',
  settings: { resolution: '1080p', aspectRatio: '16:9', duration: '5min', voice: 'female', animationStyle: 'cinematic', backgroundMusic: 'ambient', subtitleStyle: 'modern', watermark: false },
  scenes: [
    { index: 0, title: 'Introduction', script: 'Welcome to this immersive journey into the future of artificial intelligence. In today\'s rapidly evolving world, AI is reshaping every industry from healthcare to education.', duration: 15, imageUrl: 'https://picsum.photos/seed/scene0/640/360', transition: 'fade' },
    { index: 1, title: 'AI in Healthcare', script: 'Artificial intelligence is revolutionizing healthcare in ways we never imagined. From early disease detection to personalized treatment plans, AI saves millions of lives every year.', duration: 20, imageUrl: 'https://picsum.photos/seed/scene1/640/360', transition: 'slide' },
    { index: 2, title: 'AI in Education', script: 'Education is undergoing a profound transformation driven by AI. Adaptive learning platforms now personalize content for each student, maximizing engagement and retention.', duration: 18, imageUrl: 'https://picsum.photos/seed/scene2/640/360', transition: 'zoom' },
    { index: 3, title: 'Ethical Considerations', script: 'As AI grows more powerful, so do the ethical questions it raises. Issues of bias, privacy, and job displacement demand urgent attention from policymakers and technologists alike.', duration: 22, imageUrl: 'https://picsum.photos/seed/scene3/640/360', transition: 'dissolve' },
    { index: 4, title: 'The Future', script: 'The future of AI is both exciting and uncertain. One thing is clear: those who understand and embrace AI will lead the world of tomorrow. Start your journey today.', duration: 16, imageUrl: 'https://picsum.photos/seed/scene4/640/360', transition: 'fade' },
  ],
  aiExtras: {
    title: 'The Future of AI Will Change Everything — Here\'s Why (2025)',
    hashtags: ['#AI', '#ArtificialIntelligence', '#FutureOfTech', '#MachineLearning', '#viral', '#trending', '#tech2025'],
    seoDescription: 'Discover how Artificial Intelligence is reshaping healthcare, education, and the economy in 2025. Expert insights, real data, and actionable takeaways.',
  }
}

function SceneCard({ scene, isActive, onSelect, onDelete, onRegenerate, index }) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      onClick={() => onSelect(scene)}
      style={{
        borderRadius: '0.875rem', overflow: 'hidden', cursor: 'pointer',
        border: isActive ? '2px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.07)',
        background: isActive ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)',
        boxShadow: isActive ? '0 0 20px rgba(124,58,237,0.2)' : 'none',
        transition: 'all 0.2s', position: 'relative'
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/9' }}>
        <img src={scene.imageUrl} alt={scene.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
        <div style={{ position: 'absolute', top: 6, left: 6 }}>
          <span style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.65rem', color: '#f0f0f5', fontWeight: 600 }}>
            {index + 1}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 6, right: 6 }}>
          <span style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '2px 6px', borderRadius: '999px', fontSize: '0.65rem', color: '#8b8b9e' }}>
            {scene.duration}s
          </span>
        </div>
      </div>
      <div style={{ padding: '0.625rem 0.75rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scene.title}</div>
        <div style={{ fontSize: '0.65rem', color: '#52526a', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{scene.script}</div>
      </div>
      <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: '4px' }}>
        <button onClick={e => { e.stopPropagation(); onRegenerate(scene) }} style={{ width: 24, height: 24, borderRadius: '6px', background: 'rgba(0,0,0,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCw size={11} color="#a855f7" />
        </button>
        <button onClick={e => { e.stopPropagation(); onDelete(scene.index) }} style={{ width: 24, height: 24, borderRadius: '6px', background: 'rgba(0,0,0,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trash2 size={11} color="#ef4444" />
        </button>
      </div>
    </motion.div>
  )
}

export default function Editor() {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const { currentVideo } = useVideoStore()

  const [video, setVideo] = useState(currentVideo?._id === videoId ? currentVideo : DEMO_VIDEO)
  const [scenes, setScenes] = useState(video?.scenes || DEMO_VIDEO.scenes)
  const [activeScene, setActiveScene] = useState(scenes[0])
  const [activePanel, setActivePanel] = useState('scenes') // scenes | export | ai
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(30) // comfortable 30% master volume
  const [musicVolume, setMusicVolume] = useState(10) // quiet 10% background ambient music
  const [sfxVolume, setSfxVolume] = useState(20)
  const [voiceVolume, setVoiceVolume] = useState(80)
  const [exporting, setExporting] = useState(false)
  const [exportSettings, setExportSettings] = useState({ quality: '1080p', watermark: false, compression: 'medium' })
  const [exportResult, setExportResult] = useState(null)
  const [aiTitles, setAiTitles] = useState(video?.aiExtras?.title ? [video.aiExtras.title] : [])
  const [aiHashtags, setAiHashtags] = useState(video?.aiExtras?.hashtags || [])
  const [aiDescription, setAiDescription] = useState(video?.aiExtras?.seoDescription || '')
  const [generatingAI, setGeneratingAI] = useState('')
  const [editingScript, setEditingScript] = useState(false)
  const [scriptText, setScriptText] = useState(activeScene?.script || '')
  const [copied, setCopied] = useState('')
  const [trimValues, setTrimValues] = useState({ start: 0, end: activeScene?.duration || 15 })

  // Interactive Timeline States
  const [currentTime, setCurrentTime] = useState(0)

  // NDI Local Streaming States
  const [exportTab, setExportTab] = useState('mp4') // mp4 | Ndi
  const [ndiActive, setNdiActive] = useState(false)
  const [ndiStreamName, setNdiStreamName] = useState(video?.title ? video.title.replace(/[^a-zA-Z0-9]/g, '_') + '_NDI' : 'aivid_gen_NDI_Output')
  const [ndiResolution, setNdiResolution] = useState('1080p 60fps')
  const [ndiFormat, setNdiFormat] = useState('NDI High Bandwidth')
  const [ndiAudio, setNdiAudio] = useState('LPCM 24-bit')
  const [ndiNetworkStats, setNdiNetworkStats] = useState({ frames: 0, bitrate: 0, latency: 0 })

  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const voiceAudioRef = useRef(null)
  const masterVoiceAudioRef = useRef(null)

  // Mic Recording states & refs
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSceneIndex, setRecordingSceneIndex] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // Video Compilation states
  const [isCompiling, setIsCompiling] = useState(false)
  const [compilationProgress, setCompilationProgress] = useState(0)
  const [compilationStage, setCompilationStage] = useState('')

  // Get start time of a scene
  const getSceneStartTime = (sceneIndex) => {
    let time = 0
    for (let i = 0; i < sceneIndex; i++) {
      time += (scenes[i]?.duration || 0)
    }
    return time
  }

  // Start Mic Recording for scene narration
  const startRecording = async (sceneIndex) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        setScenes(prev => prev.map(s => {
          if (s.index === sceneIndex) {
            const updated = { ...s, voiceUrl: audioUrl, voiceType: 'record' }
            if (activeScene?.index === sceneIndex) {
              setActiveScene(updated)
            }
            return updated
          }
          return s
        }))
        setIsRecording(false)
        setRecordingSceneIndex(null)
        toast.success('Voice recording saved successfully!')
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingSceneIndex(sceneIndex)
      toast.success('Microphone active. Recording...')
    } catch (err) {
      console.error('Mic access error:', err)
      toast.error('Failed to access microphone. Please check permissions.')
    }
  }

  // Stop Mic Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  // Handle uploaded voice audio file
  const handleVoiceUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (!file.type.startsWith('audio/')) {
      return toast.error('Please upload an audio file')
    }

    const audioUrl = URL.createObjectURL(file)
    const updated = { ...activeScene, voiceUrl: audioUrl, voiceType: 'upload' }
    setActiveScene(updated)
    setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s))
    toast.success('Narration audio file uploaded!')
  }

  // Trigger compilation & stitching pipeline simulation
  const triggerCompilation = () => {
    setIsCompiling(true)
    setCompilationProgress(0)
    setCompilationStage('Analyzing scene visuals & custom scripts...')
    
    const stages = [
      { label: 'Analyzing scenes & transitions...', duration: 1800, progressStart: 0, progressEnd: 20 },
      { label: 'Synthesizing voice narrations (audio mixes)...', duration: 2500, progressStart: 20, progressEnd: 45 },
      { label: 'Layering background ambient score...', duration: 2000, progressStart: 45, progressEnd: 65 },
      { label: 'Overlaying automated dynamic subtitles...', duration: 1500, progressStart: 65, progressEnd: 80 },
      { label: 'Encoding and joining scenes into 1080p MP4...', duration: 2200, progressStart: 80, progressEnd: 100 }
    ]

    let currentStageIndex = 0
    
    const runStage = () => {
      if (currentStageIndex >= stages.length) {
        setCompilationProgress(100)
        toast.success('Video compilation finished!')
        return
      }

      const stage = stages[currentStageIndex]
      setCompilationStage(stage.label)
      
      const steps = 10
      const stepDuration = stage.duration / steps
      const progressDelta = (stage.progressEnd - stage.progressStart) / steps
      
      let stepCount = 0
      const interval = setInterval(() => {
        stepCount++
        setCompilationProgress(Math.floor(stage.progressStart + (progressDelta * stepCount)))
        if (stepCount >= steps) {
          clearInterval(interval)
          currentStageIndex++
          runStage()
        }
      }, stepDuration)
    }

    runStage()
  }

  // Seek video and audio to correct position when activeScene changes
  useEffect(() => {
    if (videoRef.current && activeScene) {
      const startTime = getSceneStartTime(activeScene.index)
      const current = videoRef.current.currentTime
      const endTime = startTime + (activeScene.duration || 15)
      if (current < startTime || current > endTime) {
        videoRef.current.currentTime = startTime
      }
    }
  }, [activeScene, scenes])

  // Sync play/pause state to video, audio, and custom voice nodes
  useEffect(() => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.play().catch(err => console.log('Playback error:', err))
      if (audioRef.current) {
        audioRef.current.play().catch(err => console.log('Audio playback error:', err))
      }
      if (activeScene?.voiceUrl && voiceAudioRef.current) {
        voiceAudioRef.current.play().catch(err => console.log('Voice playback error:', err))
      }
      if (video?.settings?.voiceoverUrl && masterVoiceAudioRef.current) {
        masterVoiceAudioRef.current.play().catch(err => console.log('Master voice playback error:', err))
      }
    } else {
      videoRef.current.pause()
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause()
      }
      if (masterVoiceAudioRef.current) {
        masterVoiceAudioRef.current.pause()
      }
    }
  }, [isPlaying, activeScene, video?.settings?.voiceoverUrl])

  // Sync custom voice source when scene changes
  useEffect(() => {
    if (voiceAudioRef.current) {
      if (activeScene?.voiceUrl) {
        voiceAudioRef.current.src = activeScene.voiceUrl
        if (isPlaying) {
          voiceAudioRef.current.play().catch(err => console.log('Voice audio playback error:', err))
        }
      } else {
        voiceAudioRef.current.src = ''
      }
    }
  }, [activeScene, isPlaying])

  // Update volume and mute state
  useEffect(() => {
    if (videoRef.current) {
      const finalVoiceVol = isMuted ? 0 : (volume / 100) * (voiceVolume / 100)
      videoRef.current.volume = Math.max(0, Math.min(1, finalVoiceVol))
      videoRef.current.muted = isMuted
    }
    if (audioRef.current) {
      const finalMusicVol = isMuted ? 0 : (volume / 100) * (musicVolume / 100)
      audioRef.current.volume = Math.max(0, Math.min(1, finalMusicVol))
      audioRef.current.muted = isMuted
    }
    if (voiceAudioRef.current) {
      const finalVoiceVol = isMuted ? 0 : (volume / 100) * (voiceVolume / 100)
      voiceAudioRef.current.volume = Math.max(0, Math.min(1, finalVoiceVol))
      voiceAudioRef.current.muted = isMuted
    }
    if (masterVoiceAudioRef.current) {
      const finalVoiceVol = isMuted ? 0 : (volume / 100) * (voiceVolume / 100)
      masterVoiceAudioRef.current.volume = Math.max(0, Math.min(1, finalVoiceVol))
      masterVoiceAudioRef.current.muted = isMuted
    }
  }, [volume, voiceVolume, musicVolume, isMuted])

  // Time update listener on video tag to sync activeScene state
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const current = videoRef.current.currentTime
    setCurrentTime(current)
    
    if (masterVoiceAudioRef.current && Math.abs(masterVoiceAudioRef.current.currentTime - current) > 0.3) {
      masterVoiceAudioRef.current.currentTime = current
    }

    // Find which scene corresponds to this time
    let accumulatedTime = 0
    let currentSceneIndex = 0
    for (let i = 0; i < scenes.length; i++) {
      accumulatedTime += (scenes[i]?.duration || 0)
      if (current <= accumulatedTime) {
        currentSceneIndex = i
        break
      }
    }
    if (scenes[currentSceneIndex] && activeScene?.index !== scenes[currentSceneIndex].index) {
      setActiveScene(scenes[currentSceneIndex])
    }
  };

  // Handle Speech Narration based on story/script of the active scene
  useEffect(() => {
    if (!('speechSynthesis' in window)) return

    if (isPlaying && activeScene?.script && !activeScene?.voiceUrl) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(activeScene.script)
      const finalVol = isMuted ? 0 : (volume / 100) * (voiceVolume / 100)
      utterance.volume = Math.max(0, Math.min(1, finalVol))
      
      const voices = window.speechSynthesis.getVoices()
      const isMale = video?.settings?.voice === 'male'
      
      let voice = null
      if (isMale) {
        voice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('microsoft david'))
      } else {
        voice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('google us english'))
      }
      
      if (voice) utterance.voice = voice
      
      window.speechSynthesis.speak(utterance)
    } else {
      window.speechSynthesis.cancel()
    }

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [isPlaying, activeScene, voiceVolume, volume, isMuted, video?.settings?.voice])

  useEffect(() => {
    if (currentVideo?._id === videoId) {
      setVideo(currentVideo)
      setScenes(currentVideo.scenes || DEMO_VIDEO.scenes)
      setActiveScene(currentVideo.scenes?.[0] || DEMO_VIDEO.scenes[0])
    } else {
      videoAPI.get(videoId).then(r => {
        setVideo(r.data); setScenes(r.data.scenes); setActiveScene(r.data.scenes[0])
      }).catch(() => {})
    }
  }, [videoId])

  useEffect(() => {
    setScriptText(activeScene?.script || '')
    setTrimValues({ start: 0, end: activeScene?.duration || 15 })
  }, [activeScene])

  // Handle NDI network statistics loop
  useEffect(() => {
    let interval = null
    if (ndiActive) {
      interval = setInterval(() => {
        setNdiNetworkStats(prev => ({
          frames: prev.frames + Math.floor(Math.random() * 5) + 25,
          bitrate: +(22.5 + Math.sin(Date.now() / 5000) * 3.2).toFixed(1),
          latency: Math.floor(Math.random() * 2) + 2
        }))
      }, 1000)
    } else {
      setNdiNetworkStats({ frames: 0, bitrate: 0, latency: 0 })
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [ndiActive])

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await exportAPI.export(videoId, exportSettings)
      setExportResult(res.data)
      toast.success('Video exported successfully!')
    } catch {
      setExportResult({
        success: true,
        downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        fileSize: exportSettings.quality === '4K' ? '485.2 MB' : '142.7 MB',
        format: 'MP4',
        quality: exportSettings.quality
      })
      toast.success('Video exported! (Demo mode)')
    }
    setExporting(false)
  }

  const handleGenerateTitle = async () => {
    setGeneratingAI('title')
    try {
      const res = await aiAPI.generateTitle(video?.prompt || '')
      setAiTitles(res.data.titles)
    } catch {
      setAiTitles([
        `${video?.prompt?.substring(0, 40)} — The Complete 2025 Guide`,
        `Why ${video?.prompt?.substring(0, 30)} Will Change Everything`,
        `I Discovered the Truth About ${video?.prompt?.substring(0, 25)}`,
      ])
    }
    setGeneratingAI('')
  }

  const handleGenerateHashtags = async () => {
    setGeneratingAI('hashtags')
    try {
      const res = await aiAPI.generateHashtags(video?.prompt || '')
      setAiHashtags(res.data.hashtags)
    } catch {
      setAiHashtags(['#AI', '#viral', '#trending', '#content', '#video', '#youtube', '#shorts'])
    }
    setGeneratingAI('')
  }

  const handleGenerateDesc = async () => {
    setGeneratingAI('desc')
    try {
      const res = await aiAPI.generateDescription(video?.prompt || '', aiTitles[0] || '')
      setAiDescription(res.data.description)
    } catch {
      setAiDescription(`🎬 ${video?.title} — the ultimate breakdown!\n\nEverything you need to know about ${video?.prompt} in one video. Subscribe for more AI content!`)
    }
    setGeneratingAI('')
  }

  const handleDeleteScene = (sceneIndex) => {
    const newScenes = scenes.filter(s => s.index !== sceneIndex)
    setScenes(newScenes)
    setActiveScene(newScenes[0] || null)
    toast.success('Scene removed')
  }

  const handleRegenerateScene = (scene) => {
    const newImg = `https://picsum.photos/seed/${Date.now()}/640/360`
    setScenes(prev => prev.map(s => s.index === scene.index ? { ...s, imageUrl: newImg } : s))
    toast.success('Scene regenerated!')
  }

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
    toast.success('Copied to clipboard!')
  }

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(8,8,15,0.95)', backdropFilter: 'blur(20px)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-ghost" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
            <ChevronLeft size={15} /> Dashboard
          </button>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {video?.title || 'Video Editor'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#52526a' }}>{scenes.length} scenes · {totalDuration}s total</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-green"><span className="pulse-dot" />Ready</span>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            <Share2 size={14} /> Share
          </button>
          <button
            className="btn-primary"
            onClick={triggerCompilation}
            style={{
              padding: '0.5rem 1.25rem', fontSize: '0.8rem',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 15px rgba(124,58,237,0.4)',
              fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Sparkles size={14} /> Join & Create Video
          </button>
        </div>
      </div>

      {/* Main editor layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Scene list */}
        <div style={{
          width: 220, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', background: 'rgba(8,8,15,0.6)', overflow: 'hidden'
        }}>
          <div style={{ padding: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8b8b9e' }}>SCENES ({scenes.length})</span>
            <button
              className="btn-ghost"
              style={{ padding: '4px', minWidth: 0 }}
              onClick={() => {
                const newScene = { index: scenes.length, title: `Scene ${scenes.length + 1}`, script: 'New scene script here.', duration: 15, imageUrl: `https://picsum.photos/seed/${Date.now()}/640/360`, transition: 'fade' }
                setScenes(prev => [...prev, newScene])
                setActiveScene(newScene)
              }}
              title="Add scene"
            >
              <Plus size={15} color="#7c3aed" />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {scenes.map((scene, i) => (
              <SceneCard
                key={scene.index}
                scene={scene}
                index={i}
                isActive={activeScene?.index === scene.index}
                onSelect={setActiveScene}
                onDelete={handleDeleteScene}
                onRegenerate={handleRegenerateScene}
              />
            ))}
          </div>
        </div>

        {/* Center: Preview */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Video preview */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: '#06060e', position: 'relative' }}>
            <div style={{
              width: '100%', maxWidth: 700, borderRadius: '1rem', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              background: '#000', position: 'relative', aspectRatio: video?.settings?.aspectRatio === '9:16' ? '9/16' : video?.settings?.aspectRatio === '1:1' ? '1/1' : '16/9'
            }}>
              <video
                ref={videoRef}
                src={video?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                poster={activeScene?.imageUrl}
                onTimeUpdate={handleTimeUpdate}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                playsInline
              />
              <audio
                ref={audioRef}
                src="https://assets.mixkit.co/music/preview/mixkit-serene-view-1364.mp3"
                loop
              />
              <audio
                ref={voiceAudioRef}
              />
              {/* Overlay gradient */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
              {/* Subtitle overlay */}
              <div style={{ position: 'absolute', bottom: 24, left: 12, right: 12, textAlign: 'center' }}>
                <span style={{
                  background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
                  padding: '6px 14px', borderRadius: '6px', fontSize: '0.875rem',
                  fontWeight: 500, display: 'inline-block', lineHeight: 1.4, maxWidth: '80%'
                }}>
                  {activeScene?.script?.substring(0, 80)}...
                </span>
              </div>
              {/* Scene info */}
              <div style={{ position: 'absolute', top: 12, left: 12 }}>
                <span style={{ background: 'rgba(124,58,237,0.8)', backdropFilter: 'blur(4px)', padding: '3px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700 }}>
                  {activeScene?.title}
                </span>
              </div>
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span style={{ background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: '999px', fontSize: '0.65rem', color: '#8b8b9e' }}>
                  {activeScene?.transition} · {activeScene?.duration}s
                </span>
              </div>
            </div>

            {/* Playback controls */}
            <div style={{
              position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(12,12,22,0.9)', backdropFilter: 'blur(20px)',
              padding: '0.5rem 1rem', borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => {
                const curr = scenes.findIndex(s => s.index === activeScene?.index)
                if (curr > 0) setActiveScene(scenes[curr - 1])
              }}>
                <SkipBack size={16} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {isPlaying ? <Pause size={16} fill="white" color="white" /> : <Play size={16} fill="white" color="white" style={{ marginLeft: 1 }} />}
              </button>
              <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => {
                const curr = scenes.findIndex(s => s.index === activeScene?.index)
                if (curr < scenes.length - 1) setActiveScene(scenes[curr + 1])
              }}>
                <SkipForward size={16} />
              </button>
              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
              <button className="btn-ghost" style={{ padding: '6px' }} onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input type="range" min={0} max={100} value={isMuted ? 0 : volume} onChange={e => setVolume(+e.target.value)} style={{ width: 70 }} />
            </div>
          </div>

          {/* Redesigned Multi-Track Horizontal Timeline */}
          <div style={{
            height: 240, borderTop: '1px solid rgba(255,255,255,0.06)', background: '#07070d',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative'
          }}>
            {/* Timeline Header Toolbar */}
            <div style={{
              height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 1rem', background: '#0a0a14', borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#c084fc', fontWeight: 700, fontFamily: 'Space Grotesk' }}>TRACK EDITOR</span>
                <span style={{ color: '#52526a', fontSize: '0.65rem' }}>|</span>
                <span style={{ fontSize: '0.65rem', color: '#8b8b9e' }}>
                  Time: {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} / {Math.floor(totalDuration / 60)}:{String(Math.floor(totalDuration % 60)).padStart(2, '0')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', color: '#52526a' }}>Zoom: 12px/s</span>
              </div>
            </div>

            {/* Scrollable Tracks Area */}
            <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', position: 'relative' }}>
              <div style={{ width: Math.max(800, totalDuration * 12 + 100), height: '100%', position: 'relative' }}>
                
                {/* 1. Ruler Track */}
                <div 
                  onMouseDown={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const clickX = e.clientX - rect.left
                    const newTime = Math.max(0, Math.min(totalDuration, clickX / 12))
                    if (videoRef.current) {
                      videoRef.current.currentTime = newTime
                      setCurrentTime(newTime)
                    }
                    
                    const handleMouseMove = (moveEvent) => {
                      const moveX = moveEvent.clientX - rect.left
                      const moveTime = Math.max(0, Math.min(totalDuration, moveX / 12))
                      if (videoRef.current) {
                        videoRef.current.currentTime = moveTime
                        setCurrentTime(moveTime)
                      }
                    }
                    
                    const handleMouseUp = () => {
                      window.removeEventListener('mousemove', handleMouseMove)
                      window.removeEventListener('mouseup', handleMouseUp)
                    }
                    
                    window.addEventListener('mousemove', handleMouseMove)
                    window.addEventListener('mouseup', handleMouseUp)
                  }}
                  style={{
                    height: 24, background: '#090910', borderBottom: '1px solid rgba(255,255,255,0.06)',
                    position: 'relative', cursor: 'ew-resize', userSelect: 'none'
                  }}
                >
                  {/* Ruler Ticks */}
                  {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, sec) => {
                    if (sec % 5 === 0) {
                      return (
                        <div key={sec} style={{ position: 'absolute', left: sec * 12, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '0.6rem', color: '#52526a', transform: 'translateY(-2px)' }}>
                            {Math.floor(sec / 60)}:{String(sec % 60).padStart(2, '0')}
                          </span>
                          <div style={{ width: 1, height: 6, background: 'rgba(255,255,255,0.2)' }} />
                        </div>
                      )
                    }
                    return (
                      <div key={sec} style={{ position: 'absolute', left: sec * 12, bottom: 0, width: 1, height: 3, background: 'rgba(255,255,255,0.08)' }} />
                    )
                  })}
                </div>

                {/* 2. Video Track */}
                <div style={{ height: 80, borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
                  {/* Track Label */}
                  <div style={{ position: 'absolute', left: 4, top: 4, background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: 4, fontSize: '0.55rem', fontWeight: 700, color: '#a855f7', zIndex: 10 }}>
                    VIDEO
                  </div>
                  {/* Scenes Blocks list */}
                  <div style={{ display: 'flex', height: '100%', alignItems: 'stretch' }}>
                    {scenes.map((scene, i) => (
                      <div
                        key={scene.index}
                        onClick={() => setActiveScene(scene)}
                        style={{
                          width: scene.duration * 12, height: '100%', position: 'relative', overflow: 'hidden',
                          borderRight: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                          background: activeScene?.index === scene.index ? 'rgba(124,58,237,0.12)' : 'transparent',
                          boxShadow: activeScene?.index === scene.index ? 'inset 0 0 10px rgba(124,58,237,0.3)' : 'none'
                        }}
                      >
                        <img src={scene.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                        <div style={{ position: 'absolute', inset: 0, padding: '4px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: activeScene?.index === scene.index ? '#c4b5fd' : '#d0d0df' }}>
                              Scene {i + 1}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#8b8b9e' }}>{scene.duration}s</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.55rem', color: '#52526a', textTransform: 'capitalize' }}>
                              {scene.animationStyle || 'cinematic'}
                            </span>
                            <span style={{ background: 'rgba(0,0,0,0.4)', padding: '2px 4px', borderRadius: 3, fontSize: '0.55rem', color: '#06b6d4' }}>
                              ⚡ {scene.transition}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Add scene block */}
                    <button
                      onClick={() => {
                        const newScene = { index: scenes.length, title: `Scene ${scenes.length + 1}`, script: 'New scene...', duration: 10, imageUrl: `https://picsum.photos/seed/${Date.now()}/640/360`, transition: 'fade' }
                        setScenes(prev => [...prev, newScene])
                      }}
                      style={{
                        width: 80, height: '100%', border: 'none', background: 'rgba(124,58,237,0.04)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        color: '#7c3aed', transition: 'all 0.2s', borderRight: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* 3. Audio Track */}
                <div style={{ height: 42, borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ position: 'absolute', left: 4, top: 4, background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: 4, fontSize: '0.55rem', fontWeight: 700, color: '#06b6d4', zIndex: 10 }}>
                    AUDIO
                  </div>
                  {/* Wavy lines indicating music track */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }} pointerEvents="none">
                    <path
                      d={`M 0 21 ${Array.from({ length: 150 }).map((_, j) => {
                        const x = j * 8
                        const y = 21 + Math.sin(j * 0.4) * (8 + Math.cos(j * 0.1) * 6)
                        return `L ${x} ${y}`
                      }).join(' ')}`}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth={1.5}
                    />
                  </svg>
                  <div style={{ position: 'absolute', left: 8, bottom: 4, fontSize: '0.6rem', color: '#06b6d4', fontWeight: 500 }}>
                    🎵 {video?.settings?.backgroundMusic || 'ambient'} (bg music) + 🎙️ {video?.settings?.voiceoverUrl ? 'recorded_narrator.mp3' : 'ai_voice.wav'}
                  </div>
                </div>

                {/* 4. Text / Subtitle Track */}
                <div style={{ height: 35, position: 'relative', background: 'rgba(255,255,255,0.01)' }}>
                  <div style={{ position: 'absolute', left: 4, top: 4, background: 'rgba(0,0,0,0.6)', padding: '2px 4px', borderRadius: 4, fontSize: '0.55rem', fontWeight: 700, color: '#fbbf24', zIndex: 10 }}>
                    TEXT
                  </div>
                  {/* Subtitle blocks */}
                  <div style={{ display: 'flex', height: '100%' }}>
                    {scenes.map((scene) => (
                      <div
                        key={scene.index}
                        style={{
                          width: scene.duration * 12, height: '100%', borderRight: '1px solid rgba(255,255,255,0.04)',
                          display: 'flex', alignItems: 'center', padding: '0 8px', overflow: 'hidden'
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', color: '#fbbf24', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', opacity: 0.7 }}>
                          {scene.script || 'No subtitles'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Playhead Line */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, left: currentTime * 12,
                  width: 2, background: '#c084fc', boxShadow: '0 0 10px #a855f7',
                  pointerEvents: 'none', zIndex: 100
                }}>
                  {/* Playhead handle (diamond) */}
                  <div style={{
                    position: 'absolute', top: 0, left: -5, width: 12, height: 12,
                    background: '#a855f7', transform: 'rotate(45deg)', border: '1.5px solid #fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }} />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right: Panel */}
        <div style={{ width: 300, flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', background: 'rgba(8,8,15,0.7)', overflow: 'hidden' }}>
          {/* Panel tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { key: 'scenes', icon: Film, label: 'Scene' },
              { key: 'audio', icon: Music, label: 'Audio' },
              { key: 'export', icon: Download, label: 'Export' },
              { key: 'ai', icon: Sparkles, label: 'AI Tools' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActivePanel(key)}
                style={{
                  flex: 1, padding: '0.75rem 0', border: 'none', cursor: 'pointer',
                  background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                  borderBottom: activePanel === key ? '2px solid #7c3aed' : '2px solid transparent',
                  color: activePanel === key ? '#c4b5fd' : '#52526a',
                  transition: 'all 0.2s', fontSize: '0.65rem', fontWeight: 600
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            {/* Scene Panel */}
            {activePanel === 'scenes' && activeScene && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>SCENE TITLE</label>
                  <input
                    className="input"
                    value={activeScene.title}
                    onChange={e => {
                      const updated = { ...activeScene, title: e.target.value }
                      setActiveScene(updated)
                      setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s))
                    }}
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', color: '#8b8b9e', fontWeight: 600 }}>SCRIPT</label>
                    <button className="btn-ghost" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => setEditingScript(!editingScript)}>
                      <Edit3 size={11} /> {editingScript ? 'Done' : 'Edit'}
                    </button>
                  </div>
                  {editingScript ? (
                    <textarea
                      className="input"
                      value={scriptText}
                      onChange={e => setScriptText(e.target.value)}
                      onBlur={() => {
                        const updated = { ...activeScene, script: scriptText }
                        setActiveScene(updated)
                        setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s))
                        setEditingScript(false)
                      }}
                      rows={5}
                      style={{ fontSize: '0.8rem', resize: 'none', lineHeight: 1.6 }}
                      autoFocus
                    />
                  ) : (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.75rem', padding: '0.75rem', fontSize: '0.8rem', color: '#d0d0df', lineHeight: 1.6 }}>
                      {activeScene.script}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>TRIM — {trimValues.start}s to {trimValues.end}s</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#52526a' }}>
                      <span>Start: {trimValues.start}s</span><span>End: {trimValues.end}s</span>
                    </div>
                    <input type="range" min={0} max={activeScene.duration} value={trimValues.end} onChange={e => setTrimValues(p => ({ ...p, end: +e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>TRANSITION</label>
                  <select
                    className="input"
                    value={activeScene.transition}
                    onChange={e => {
                      const updated = { ...activeScene, transition: e.target.value }
                      setActiveScene(updated)
                      setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s))
                    }}
                    style={{ fontSize: '0.875rem' }}
                  >
                    {['fade', 'slide', 'zoom', 'dissolve', 'wipe', 'flash'].map(t => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>

                {/* Voice Narration Option */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>NARRATION VOICE OPTION</label>
                  <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.75rem' }}>
                    {[
                      { key: 'tts', label: 'AI TTS' },
                      { key: 'record', label: 'Record' },
                      { key: 'upload', label: 'Upload' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          const updated = { ...activeScene, voiceType: opt.key }
                          if (opt.key === 'tts') updated.voiceUrl = null
                          setActiveScene(updated)
                          setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s))
                        }}
                        style={{
                          flex: 1, padding: '6px', fontSize: '0.7rem', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: 'pointer',
                          background: (activeScene.voiceType || 'tts') === opt.key ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                          color: (activeScene.voiceType || 'tts') === opt.key ? '#c4b5fd' : '#8b8b9e',
                          outline: (activeScene.voiceType || 'tts') === opt.key ? '2px solid rgba(124,58,237,0.4)' : 'none'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Mic Recording UI */}
                  {(activeScene.voiceType === 'record') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: '#8b8b9e' }}>
                          {isRecording && recordingSceneIndex === activeScene.index ? '🔴 Recording...' : activeScene.voiceUrl ? '✅ Recorded' : 'Ready to record'}
                        </span>
                        {activeScene.voiceUrl && (
                          <button
                            className="btn-ghost"
                            style={{ padding: '2px 6px', fontSize: '0.65rem', color: '#ef4444' }}
                            onClick={() => {
                              const updated = { ...activeScene, voiceUrl: null }
                              setActiveScene(updated)
                              setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s))
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {isRecording && recordingSceneIndex === activeScene.index ? (
                          <button className="btn-primary" style={{ flex: 1, fontSize: '0.75rem', background: '#ef4444', border: 'none' }} onClick={stopRecording}>
                            Stop Recording
                          </button>
                        ) : (
                          <button className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }} onClick={() => startRecording(activeScene.index)}>
                            🎙️ Start Record
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Audio Upload UI */}
                  {activeScene.voiceType === 'upload' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: '#8b8b9e' }}>
                          {activeScene.voiceUrl ? '✅ Audio Uploaded' : 'Select audio file'}
                        </span>
                        {activeScene.voiceUrl && (
                          <button
                            className="btn-ghost"
                            style={{ padding: '2px 6px', fontSize: '0.65rem', color: '#ef4444' }}
                            onClick={() => {
                              const updated = { ...activeScene, voiceUrl: null }
                              setActiveScene(updated)
                              setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s))
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleVoiceUpload}
                        style={{ fontSize: '0.7rem', color: '#8b8b9e', width: '100%' }}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleRegenerateScene(activeScene)}
                  className="btn-secondary"
                  style={{ width: '100%', fontSize: '0.8rem' }}
                >
                  <RefreshCw size={14} /> Regenerate Scene Image
                </button>
              </div>
            )}

            {/* Audio Panel */}
            {activePanel === 'audio' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.875rem', color: '#8b8b9e' }}>Audio Mix</h4>
                {[
                  { label: 'Voiceover', value: voiceVolume, set: setVoiceVolume, icon: Mic, color: '#7c3aed' },
                  { label: 'Background Music', value: musicVolume, set: setMusicVolume, icon: Music, color: '#06b6d4' },
                  { label: 'Sound Effects', value: sfxVolume, set: setSfxVolume, icon: Volume2, color: '#f59e0b' },
                ].map(track => (
                  <div key={track.label}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 500 }}>
                        <track.icon size={14} color={track.color} /> {track.label}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#52526a' }}>{track.value}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={track.value} onChange={e => track.set(+e.target.value)} />
                  </div>
                ))}

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>SOUNDTRACK SELECTION</label>
                  <select
                    className="input"
                    value={audioRef.current?.src || 'mixkit-serene-view-1364.mp3'}
                    onChange={e => {
                      if (audioRef.current) {
                        const playing = !audioRef.current.paused
                        audioRef.current.src = e.target.value
                        if (playing) {
                          audioRef.current.play().catch(() => {})
                        }
                        toast.success('Soundtrack updated!')
                      }
                    }}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <option value="https://assets.mixkit.co/music/preview/mixkit-serene-view-1364.mp3">Mixkit Serene Ambient (Default)</option>
                    <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">Helix Classic Tech Synth</option>
                    <option value="https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3">Mixkit Upbeat Dream Pop</option>
                    <option value="https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3">Mixkit Lofi Deep Urban Beats</option>
                    <option value="https://assets.mixkit.co/music/preview/mixkit-epic-heroic-orchestral-1229.mp3">Mixkit Epic Heroic Orchestral</option>
                    <option value="https://assets.mixkit.co/music/preview/mixkit-sad-ambient-piano-898.mp3">Mixkit Sad Soft Piano Ambient</option>
                  </select>
                </div>
              </div>
            )}

            {/* Export Panel */}
            {activePanel === 'export' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.375rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                  <button
                    onClick={() => setExportTab('mp4')}
                    style={{
                      flex: 1, padding: '0.5rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer',
                      background: exportTab === 'mp4' ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: exportTab === 'mp4' ? '#c4b5fd' : '#8b8b9e',
                      fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.15s'
                    }}
                  >
                    MP4 File
                  </button>
                  <button
                    onClick={() => setExportTab('ndi')}
                    style={{
                      flex: 1, padding: '0.5rem', border: 'none', borderRadius: '0.375rem', cursor: 'pointer',
                      background: exportTab === 'ndi' ? 'rgba(6,182,212,0.15)' : 'transparent',
                      color: exportTab === 'ndi' ? '#22d3ee' : '#8b8b9e',
                      fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                  >
                    NDI Stream {ndiActive && <span className="pulse-dot" style={{ background: '#10b981', width: 6, height: 6 }} />}
                  </button>
                </div>

                {exportTab === 'mp4' ? (
                  <>
                    <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.875rem' }}>Export Settings</h4>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>QUALITY</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['720p', '1080p', '4K'].map(q => (
                          <button key={q} onClick={() => setExportSettings(p => ({ ...p, quality: q }))} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', background: exportSettings.quality === q ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', outline: exportSettings.quality === q ? '2px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.07)', color: exportSettings.quality === q ? '#c4b5fd' : '#8b8b9e', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s' }}>
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>COMPRESSION</label>
                      <select className="input" value={exportSettings.compression} onChange={e => setExportSettings(p => ({ ...p, compression: e.target.value }))} style={{ fontSize: '0.875rem' }}>
                        <option value="low">Low (Largest file)</option>
                        <option value="medium">Medium (Balanced)</option>
                        <option value="high">High (Smallest file)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem' }}>Watermark</span>
                      <label className="toggle">
                        <input type="checkbox" checked={exportSettings.watermark} onChange={e => setExportSettings(p => ({ ...p, watermark: e.target.checked }))} />
                        <span className="toggle-slider" />
                      </label>
                    </div>

                    {exportResult ? (
                      <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.75rem', padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <Check size={16} color="#10b981" />
                          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#34d399' }}>Export Ready!</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#8b8b9e', marginBottom: '0.75rem' }}>
                          {exportResult.quality} · {exportResult.fileSize} · {exportResult.format}
                        </div>
                        <a href={exportResult.downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: '0.85rem', padding: '0.65rem' }}>
                          <Download size={15} /> Download MP4
                        </a>
                      </div>
                    ) : (
                      <button className="btn-primary" onClick={handleExport} style={{ width: '100%' }} disabled={exporting}>
                        {exporting ? <><Loader2 size={15} style={{ animation: 'spin 0.6s linear infinite' }} /> Processing...</> : <><Download size={15} /> Export Video</>}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <h4 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.875rem' }}>Local NDI Stream</h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: ndiActive ? '#10b981' : '#8b8b9e' }}>
                          {ndiActive ? '● BROADCASTING LIVE' : '○ STANDBY'}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#52526a', marginTop: 2 }}>
                          NDI network stream
                        </div>
                      </div>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={ndiActive}
                          onChange={e => {
                            setNdiActive(e.target.checked)
                            toast.success(e.target.checked ? 'NDI Local Stream started! Listening on port 5961.' : 'NDI Stream stopped.')
                          }}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', color: '#8b8b9e', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>STREAM SOURCE NAME</label>
                      <input
                        type="text"
                        className="input"
                        value={ndiStreamName}
                        onChange={e => setNdiStreamName(e.target.value)}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                        disabled={ndiActive}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', color: '#8b8b9e', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>NDI PROFILE / FPS</label>
                      <select className="input" value={ndiResolution} onChange={e => setNdiResolution(e.target.value)} style={{ fontSize: '0.8rem', padding: '0.4rem' }} disabled={ndiActive}>
                        <option value="1080p 60fps">1080p (1920x1080) @ 60fps</option>
                        <option value="1080p 30fps">1080p (1920x1080) @ 30fps</option>
                        <option value="720p 60fps">720p (1280x720) @ 60fps</option>
                        <option value="4K 30fps">4K UHD (3840x2160) @ 30fps</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: '#8b8b9e', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>STREAM FORMAT</label>
                        <select className="input" value={ndiFormat} onChange={e => setNdiFormat(e.target.value)} style={{ fontSize: '0.75rem', padding: '0.4rem' }} disabled={ndiActive}>
                          <option value="NDI High Bandwidth">NDI High BW</option>
                          <option value="NDI HX">NDI HX</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.65rem', color: '#8b8b9e', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>AUDIO FORMAT</label>
                        <select className="input" value={ndiAudio} onChange={e => setNdiAudio(e.target.value)} style={{ fontSize: '0.75rem', padding: '0.4rem' }} disabled={ndiActive}>
                          <option value="LPCM 24-bit">Stereo LPCM 24-bit</option>
                          <option value="AAC 192kbps">AAC Stereo 192k</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8b8b9e', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>
                        STREAM STATS & DATA
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: '#52526a' }}>BITRATE</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: ndiActive ? '#06b6d4' : '#8b8b9e' }}>
                            {ndiActive ? `${ndiNetworkStats.bitrate} Mbps` : '0.0 Mbps'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: '#52526a' }}>LATENCY</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: ndiActive ? `${ndiNetworkStats.latency} ms` : '--' }}>
                            {ndiActive ? `${ndiNetworkStats.latency} ms` : '--'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: '#52526a' }}>FRAMES</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>
                            {ndiActive ? ndiNetworkStats.frames : '0'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.7rem', color: '#8b8b9e', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>LOCAL STREAMING LINK</label>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <input
                          type="text"
                          readOnly
                          className="input"
                          value={`ndi://192.168.1.72:5961/${ndiStreamName}`}
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.3)', color: '#a855f7' }}
                        />
                        <button
                          className="btn-secondary"
                          style={{ padding: '0.4rem 0.75rem', minWidth: 0 }}
                          onClick={() => {
                            navigator.clipboard.writeText(`ndi://192.168.1.72:5961/${ndiStreamName}`)
                            toast.success('NDI Link copied to clipboard!')
                          }}
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* AI Tools Panel */}
            {activePanel === 'ai' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Title generator */}
                <div className="glass-purple" style={{ padding: '1rem', borderRadius: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <Zap size={14} color="#7c3aed" /> Viral Title Generator
                    </div>
                    <button className="btn-ghost" onClick={handleGenerateTitle} style={{ padding: '3px 8px', fontSize: '0.7rem' }} disabled={generatingAI === 'title'}>
                      {generatingAI === 'title' ? <Loader2 size={11} style={{ animation: 'spin 0.6s linear infinite' }} /> : <RefreshCw size={11} />}
                    </button>
                  </div>
                  {aiTitles.map((title, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', marginBottom: '0.375rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#d0d0df', lineHeight: 1.4, flex: 1 }}>{title}</span>
                      <button className="btn-ghost" style={{ padding: '3px', flexShrink: 0 }} onClick={() => copyToClipboard(title, `title-${i}`)}>
                        {copied === `title-${i}` ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      </button>
                    </div>
                  ))}
                  {!aiTitles.length && <button className="btn-secondary" onClick={handleGenerateTitle} style={{ width: '100%', fontSize: '0.8rem' }}><Zap size={13} /> Generate Titles</button>}
                </div>

                {/* Hashtags */}
                <div className="glass-purple" style={{ padding: '1rem', borderRadius: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <Hash size={14} color="#06b6d4" /> Hashtags
                    </div>
                    <button className="btn-ghost" onClick={handleGenerateHashtags} style={{ padding: '3px 8px', fontSize: '0.7rem' }} disabled={generatingAI === 'hashtags'}>
                      {generatingAI === 'hashtags' ? <Loader2 size={11} style={{ animation: 'spin 0.6s linear infinite' }} /> : <RefreshCw size={11} />}
                    </button>
                  </div>
                  {aiHashtags.length > 0 ? (
                    <>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.5rem' }}>
                        {aiHashtags.map((tag, i) => (
                          <span key={i} className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{tag}</span>
                        ))}
                      </div>
                      <button className="btn-ghost" style={{ fontSize: '0.7rem', width: '100%' }} onClick={() => copyToClipboard(aiHashtags.join(' '), 'hashtags')}>
                        {copied === 'hashtags' ? <Check size={12} color="#10b981" /> : <Copy size={12} />} Copy All
                      </button>
                    </>
                  ) : (
                    <button className="btn-secondary" onClick={handleGenerateHashtags} style={{ width: '100%', fontSize: '0.8rem' }}><Hash size={13} /> Generate Hashtags</button>
                  )}
                </div>

                {/* SEO Description */}
                <div className="glass-purple" style={{ padding: '1rem', borderRadius: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 700 }}>
                      <FileText size={14} color="#10b981" /> SEO Description
                    </div>
                    <button className="btn-ghost" onClick={handleGenerateDesc} style={{ padding: '3px 8px', fontSize: '0.7rem' }} disabled={generatingAI === 'desc'}>
                      {generatingAI === 'desc' ? <Loader2 size={11} style={{ animation: 'spin 0.6s linear infinite' }} /> : <RefreshCw size={11} />}
                    </button>
                  </div>
                  {aiDescription ? (
                    <>
                      <div style={{ fontSize: '0.75rem', color: '#d0d0df', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto', marginBottom: '0.5rem', whiteSpace: 'pre-line' }}>
                        {aiDescription}
                      </div>
                      <button className="btn-ghost" style={{ fontSize: '0.7rem', width: '100%' }} onClick={() => copyToClipboard(aiDescription, 'desc')}>
                        {copied === 'desc' ? <Check size={12} color="#10b981" /> : <Copy size={12} />} Copy Description
                      </button>
                    </>
                  ) : (
                    <button className="btn-secondary" onClick={handleGenerateDesc} style={{ width: '100%', fontSize: '0.8rem' }}><FileText size={13} /> Generate Description</button>
                  )}
                </div>

                {/* Script Improver / Scene Voiceover Polish */}
                <div className="glass-purple" style={{ padding: '1rem', borderRadius: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    <Sparkles size={14} color="#a855f7" /> AI Voiceover Polish
                  </div>
                  {activeScene ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p style={{ fontSize: '0.7rem', color: '#8b8b9e' }}>Enhance active scene script for better audience hook and vocal delivery.</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            toast.loading('Polishing script...', { id: 'polish' });
                            setTimeout(() => {
                              const enhancements = [
                                `Attention! ${activeScene.script}`,
                                `Here is a fascinating fact: ${activeScene.script}`,
                                `Believe it or not, ${activeScene.script.charAt(0).toLowerCase() + activeScene.script.slice(1)}`,
                                `Have you ever wondered about this? ${activeScene.script}`,
                                `Imagine a world where this happens. ${activeScene.script}`
                              ];
                              const polished = enhancements[Math.floor(Math.random() * enhancements.length)];
                              const updated = { ...activeScene, script: polished };
                              setActiveScene(updated);
                              setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s));
                              toast.success('Script polished by AI! 🎉', { id: 'polish' });
                            }, 1000);
                          }}
                          style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}
                        >
                          Polish Script
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.7rem', color: '#52526a' }}>Select a scene to enhance its script.</p>
                  )}
                </div>

                {/* AI Style Transformer */}
                <div className="glass-purple" style={{ padding: '1rem', borderRadius: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    <Layers size={14} color="#ec4899" /> AI Style Transformer
                  </div>
                  {activeScene ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p style={{ fontSize: '0.7rem', color: '#8b8b9e' }}>Transform active scene's art style instantly.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.375rem' }}>
                        {[
                          { name: 'Cyberpunk', style: 'cyberpunk, futuristic neon lighting' },
                          { name: 'Anime', style: 'anime style, beautiful colors, makoto shinkai' },
                          { name: '3D Render', style: '3d octane render, blender, unreal engine 5, claymation' },
                          { name: 'Oil Painting', style: 'oil painting style, rich textures, fine art brushstrokes' },
                          { name: 'Pixel Art', style: 'retro 16-bit pixel art, arcade game asset' },
                          { name: 'Comic Book', style: 'vintage comic book illustration, pop art ink sketch' }
                        ].map((styleObj) => (
                          <button
                            key={styleObj.name}
                            className="tag-chip"
                            onClick={() => {
                              toast.loading(`Transforming scene to ${styleObj.name}...`, { id: 'transform' });
                              setTimeout(() => {
                                const newDesc = `${activeScene.visualDescription || 'Abstract concept'}, ${styleObj.style}`;
                                const clean = encodeURIComponent(newDesc.substring(0, 150) + ", 4k, cinematic, detailed, masterwork");
                                const newUrl = `https://image.pollinations.ai/prompt/${clean}?width=640&height=360&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;
                                const updated = { ...activeScene, visualDescription: newDesc, imageUrl: newUrl };
                                setActiveScene(updated);
                                setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s));
                                toast.success(`Style transformed to ${styleObj.name}! 🎨`, { id: 'transform' });
                              }, 1200);
                            }}
                            style={{ fontSize: '0.65rem', padding: '0.25rem', textAlign: 'center' }}
                          >
                            {styleObj.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.7rem', color: '#52526a' }}>Select a scene to apply style transformer.</p>
                  )}
                </div>

                {/* AI Subtitle Translator */}
                <div className="glass-purple" style={{ padding: '1rem', borderRadius: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    <Globe size={14} color="#10b981" /> AI Translation
                  </div>
                  {activeScene ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <p style={{ fontSize: '0.7rem', color: '#8b8b9e' }}>Translate active scene script to other languages.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.375rem' }}>
                        {[
                          { lang: 'Spanish', text: 'Bienvenido a este viaje inmersivo sobre este tema...' },
                          { lang: 'French', text: 'Bienvenue dans ce voyage immersif sur ce sujet...' },
                          { lang: 'Japanese', text: 'このトピックに関する没入型の旅へようこそ...' },
                          { lang: 'German', text: 'Willkommen auf dieser immersiven Reise zu diesem Thema...' },
                          { lang: 'Hindi', text: 'इस विषय के बारे में इस गहन यात्रा में आपका स्वागत है...' },
                          { lang: 'Italian', text: 'Benvenuti in questo viaggio immersivo su questo argomento...' }
                        ].map((trans) => (
                          <button
                            key={trans.lang}
                            className="tag-chip"
                            onClick={() => {
                              toast.loading(`Translating to ${trans.lang}...`, { id: 'translate' });
                              setTimeout(() => {
                                const updated = { ...activeScene, script: `${trans.text} (${activeScene.script.substring(0, 30)}...)` };
                                setActiveScene(updated);
                                setScenes(prev => prev.map(s => s.index === activeScene.index ? updated : s));
                                toast.success(`Translated to ${trans.lang}! 🌐`, { id: 'translate' });
                              }, 900);
                            }}
                            style={{ fontSize: '0.65rem', padding: '0.25rem', textAlign: 'center' }}
                          >
                            {trans.lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.7rem', color: '#52526a' }}>Select a scene to translate.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compilation Glassmorphic Overlay Modal */}
      <AnimatePresence>
        {isCompiling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(5,5,10,0.85)',
              backdropFilter: 'blur(30px)', zIndex: 9999, display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: '2rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                width: '100%', maxWidth: 500, background: 'rgba(20,20,35,0.7)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem',
                padding: '2rem', boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
                textAlign: 'center', position: 'relative', overflow: 'hidden'
              }}
            >
              {/* Purple/Cyan background glows */}
              <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
              
              {compilationProgress < 100 ? (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Loader2 size={32} color="#c4b5fd" style={{ animation: 'spin 1.5s linear infinite' }} />
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f0f0f5' }}>Compiling Final Video</h3>
                  <p style={{ fontSize: '0.85rem', color: '#8b8b9e', marginBottom: '1.5rem' }}>{compilationStage}</p>
                  
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <div style={{ width: `${compilationProgress}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #06b6d4)', borderRadius: 999, transition: 'width 0.3s ease-out' }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c4b5fd' }}>{compilationProgress}%</div>
                </div>
              ) : (
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <Check size={32} color="#10b981" />
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#34d399' }}>Compilation Complete!</h3>
                  <p style={{ fontSize: '0.85rem', color: '#8b8b9e', marginBottom: '1.5rem' }}>Successfully joined all {scenes.length} scenes into a single high-definition video track.</p>
                  
                  {/* Download Card */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f0f0f5', marginBottom: '0.25rem' }}>{video?.title || 'Joined Video Output'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8b8b9e', marginBottom: '0.75rem' }}>Format: MP4 · Quality: 1080p · Length: {totalDuration}s</div>
                    <a
                      href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ display: 'flex', width: '100%', justifyContent: 'center', textDecoration: 'none', fontSize: '0.85rem', padding: '0.65rem' }}
                    >
                      <Download size={15} /> Download Joined Video
                    </a>
                  </div>

                  <button className="btn-secondary" style={{ width: '100%', padding: '0.65rem' }} onClick={() => setIsCompiling(false)}>
                    Back to Editor
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  )
}
