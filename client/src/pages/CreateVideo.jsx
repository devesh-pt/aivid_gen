import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Mic, MicOff, ChevronLeft, Wand2,
  Volume2, Upload, Play, CheckCircle2, Circle,
  ArrowRight, RotateCcw, Film, Monitor, Smartphone,
  Square, Clock, X, Loader2
} from 'lucide-react'
import { useVideoStore } from '../store/videoStore'
import { generationAPI } from '../services/api'
import { useSocket } from '../hooks/useSocket'
import toast from 'react-hot-toast'

const EXAMPLE_PROMPTS = [
  'A cinematic documentary about the future of AI replacing human jobs by 2030',
  'A motivational video for entrepreneurs about overcoming failure and building success',
  'A product reveal video for the world\'s first self-healing smartphone',
  'A travel vlog exploring the neon-lit streets of Tokyo at night',
  'An educational video explaining quantum computing to a 10-year-old',
  'A horror movie trailer for a psychological thriller about AI consciousness',
]

const PIPELINE_STAGES = [
  { key: 'scriptGeneration', label: 'Generating Script', icon: '📝' },
  { key: 'sceneBreakdown', label: 'Scene Breakdown', icon: '🎬' },
  { key: 'visualGeneration', label: 'Generating Visuals', icon: '🖼️' },
  { key: 'animationCreation', label: 'Creating Animations', icon: '✨' },
  { key: 'transitions', label: 'Adding Transitions', icon: '🔄' },
  { key: 'subtitleGeneration', label: 'Subtitles', icon: '💬' },
  { key: 'voiceoverGeneration', label: 'AI Voiceover', icon: '🎙️' },
  { key: 'backgroundMusic', label: 'Background Music', icon: '🎵' },
  { key: 'soundEffects', label: 'Sound Effects', icon: '🔊' },
  { key: 'audioSync', label: 'Syncing Audio', icon: '🎛️' },
]

function PipelineView({ videoId, onComplete }) {
  const { pipelineStages, overallProgress, isGenerating, currentVideo } = useVideoStore()
  useSocket(videoId)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!isGenerating && overallProgress >= 100 && currentVideo && !completedRef.current) {
      completedRef.current = true
      onComplete(currentVideo)
    }
  }, [isGenerating, overallProgress, currentVideo])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          style={{ display: 'inline-block', marginBottom: '1rem' }}
        >
          <Sparkles size={36} color="#7c3aed" />
        </motion.div>
        <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          AI is Creating Your Video
        </h2>
        <p style={{ color: '#8b8b9e', fontSize: '0.9rem' }}>This takes 1–3 minutes. Sit back and relax!</p>
      </div>

      {/* Overall progress */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Overall Progress</span>
          <span className="gradient-text" style={{ fontWeight: 700, fontSize: '1rem' }}>{overallProgress}%</span>
        </div>
        <div className="progress-track" style={{ height: 10, marginBottom: '0.5rem' }}>
          <motion.div
            className="progress-fill"
            style={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#52526a' }}>
          {pipelineStages.find(s => s.status === 'running')?.label || (overallProgress === 0 ? 'Preparing pipeline...' : 'Finalizing...')}
        </p>
      </div>

      {/* Stage list */}
      <div className="glass" style={{ padding: '1.25rem' }}>
        {PIPELINE_STAGES.map((stage, i) => {
          const stageData = pipelineStages.find(s => s.key === stage.key)
          const status = stageData?.status || 'pending'
          const progress = stageData?.progress || 0

          return (
            <motion.div
              key={stage.key}
              animate={{ opacity: status === 'pending' ? 0.4 : 1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                padding: '0.625rem 0',
                borderBottom: i < PIPELINE_STAGES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
              }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0, width: 24, textAlign: 'center' }}>{stage.icon}</span>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: status === 'running' ? '0.375rem' : 0 }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: status !== 'pending' ? 600 : 400,
                    color: status === 'pending' ? '#52526a' : '#f0f0f5'
                  }}>
                    {stage.label}
                  </span>
                  {status === 'running' && (
                    <span style={{ fontSize: '0.7rem', color: '#7c3aed' }}>{progress}%</span>
                  )}
                </div>
                {status === 'running' && (
                  <div className="progress-track" style={{ height: 3 }}>
                    <motion.div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </div>

              <div style={{ flexShrink: 0 }}>
                {status === 'completed' ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : status === 'running' ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 size={18} color="#7c3aed" />
                  </motion.div>
                ) : (
                  <Circle size={18} color="#52526a" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

const STEPS = ['prompt', 'settings', 'generating', 'done']

export default function CreateVideo() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setGenerating, stopGenerating } = useVideoStore()

  const [step, setStep] = useState('prompt')
  const [prompt, setPrompt] = useState(location.state?.prompt || '')
  const [isListening, setIsListening] = useState(false)
  const [generatingVideoId, setGeneratingVideoId] = useState(null)
  const [completedVideo, setCompletedVideo] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const logoInputRef = useRef(null)
  const recognitionRef = useRef(null)

  const [settings, setSettings] = useState({
    resolution: '1080p',
    aspectRatio: '16:9',
    duration: '1min',
    customDuration: '',
    voice: 'female',
    animationStyle: 'cinematic',
    subtitleStyle: 'modern',
    backgroundMusic: 'ambient',
    watermark: false,
  })

  // Voiceover Custom States
  const [voiceoverMode, setVoiceoverMode] = useState('tts') // tts | upload | record
  const [ttsProfile, setTtsProfile] = useState('storyteller') // storyteller | corporate | enthusiastic | chill
  const [ttsScriptPrompt, setTtsScriptPrompt] = useState('')
  const [voiceoverFile, setVoiceoverFile] = useState(null)
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null)
  
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordingTimerRef = useRef(null)

  // Template loader effect
  useEffect(() => {
    if (location.state?.template) {
      const t = location.state.template
      setPrompt(`A beautiful, professional video styled as a ${t.name}: ${t.desc}`)
      setSettings(prev => ({
        ...prev,
        resolution: t.resolution === '4K' ? '4K' : t.resolution === '720p' ? '720p' : '1080p',
        aspectRatio: t.aspectRatio || '16:9',
        duration: t.duration === '30sec' ? '30sec' : t.duration === '5min' ? '5min' : t.duration === '10min' ? '10min' : '1min',
        animationStyle: t.category.toLowerCase() === 'travel' ? 'artistic' : t.category.toLowerCase() === 'gaming' ? 'gaming' : 'cinematic'
      }))
      toast.success(`Loaded template: ${t.name}!`)
    }
  }, [location.state])

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setRecordedBlobUrl(audioUrl)
        toast.success('Voiceover recorded successfully!')
        
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecordingVoice(true)
      setRecordingSeconds(0)
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1)
      }, 1000)
      toast.success('Microphone active. Recording started...')
    } catch (err) {
      console.error(err)
      toast.error('Could not access microphone')
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop()
      setIsRecordingVoice(false)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }

  const updateSetting = (key, value) => setSettings(prev => ({ ...prev, [key]: value }))

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return toast.error('Voice input not supported in this browser')
    }
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
      setPrompt(transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
    toast.success('Listening... speak your prompt!')
  }

  const simulatePipeline = useCallback(async (videoId, promptText) => {
    const { updatePipelineStage, completeGeneration } = useVideoStore.getState()
    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      const stage = PIPELINE_STAGES[i]
      for (let p = 0; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 200))
        updatePipelineStage({
          stage: stage.key,
          stageLabel: stage.label,
          stageIndex: i,
          totalStages: PIPELINE_STAGES.length,
          stageStatus: p < 100 ? 'running' : 'completed',
          stageProgress: p,
          overallProgress: Math.floor(((i + p / 100) / PIPELINE_STAGES.length) * 100)
        })
      }
    }

    // Determine custom voiceover url if provided
    let voiceUrl = null
    if (voiceoverMode === 'upload' && voiceoverFile) {
      voiceUrl = URL.createObjectURL(voiceoverFile)
    } else if (voiceoverMode === 'record' && recordedBlobUrl) {
      voiceUrl = recordedBlobUrl
    }

    const fakeVideo = {
      _id: videoId,
      prompt: promptText,
      status: 'completed',
      progress: 100,
      title: promptText.substring(0, 60),
      settings: {
        resolution: settings.resolution,
        aspectRatio: settings.aspectRatio,
        duration: settings.duration,
        voiceoverUrl: voiceUrl,
        voiceoverType: voiceoverMode,
        voiceProfile: ttsProfile,
        voiceoverScript: ttsScriptPrompt
      },
      scenes: Array.from({ length: 5 }, (_, idx) => {
        const visualDesc = `Cinematic shot showing scene ${idx + 1} of ${promptText}, high-end digital art style, detailed, masterwork`;
        const cleanPrompt = encodeURIComponent(visualDesc + ", 4k, detailed");
        return {
          index: idx,
          title: `Scene ${idx + 1}`,
          script: `Here is the AI generated narration for scene ${idx + 1} relating to ${promptText}. Details explain how this context unfolds.`,
          visualDescription: visualDesc,
          duration: 12,
          transition: ['fade', 'slide', 'zoom', 'dissolve', 'fade'][idx],
          imageUrl: `https://image.pollinations.ai/prompt/${cleanPrompt}?width=640&height=360&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`
        }
      }),
      aiExtras: {
        title: `${promptText.substring(0, 40)} — The Complete Guide`,
        hashtags: ['#viral', '#ai', '#video', '#trending', '#content'],
        seoDescription: `Discover everything about ${promptText.substring(0, 50)} in this AI-generated video.`
      }
    }
    completeGeneration(fakeVideo)
    setCompletedVideo(fakeVideo)
    stopGenerating()
  }, [stopGenerating, settings, voiceoverMode, voiceoverFile, recordedBlobUrl, ttsProfile, ttsScriptPrompt])

  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error('Please enter a video prompt')
    if (prompt.trim().length < 10) return toast.error('Prompt is too short. Be more descriptive!')

    const currentPrompt = prompt
    try {
      const res = await generationAPI.start(currentPrompt, settings)
      const videoId = res.data.videoId
      setGeneratingVideoId(videoId)
      setGenerating(videoId)
      setStep('generating')
    } catch {
      // Demo/offline mode
      const fakeId = `demo-${Date.now()}`
      setGeneratingVideoId(fakeId)
      setGenerating(fakeId)
      setStep('generating')
      simulatePipeline(fakeId, currentPrompt)
    }
  }

  const handlePipelineComplete = useCallback((video) => {
    setCompletedVideo(video)
    setStep('done')
  }, [])

  const RESOLUTION_OPTIONS = [
    { value: '720p', label: '720p HD', badge: 'Standard' },
    { value: '1080p', label: '1080p Full HD', badge: 'Popular' },
    { value: '4K', label: '4K Ultra HD', badge: 'Pro' },
  ]
  const ASPECT_RATIOS = [
    { value: '16:9', icon: Monitor, label: '16:9', sub: 'YouTube' },
    { value: '9:16', icon: Smartphone, label: '9:16', sub: 'Shorts/Reels' },
    { value: '1:1', icon: Square, label: '1:1', sub: 'Instagram' },
  ]
  const DURATIONS = [
    { value: '30sec', label: '30 sec' },
    { value: '1min', label: '1 min' },
    { value: '5min', label: '5 min' },
    { value: '10min', label: '10 min' },
    { value: 'custom', label: 'Custom' },
  ]
  const ANIMATION_STYLES = ['cinematic', 'dynamic', 'minimal', 'corporate', 'artistic', 'gaming']
  const MUSIC_STYLES = ['ambient', 'upbeat', 'dramatic', 'corporate', 'lo-fi', 'epic']
  const SUBTITLE_STYLES = ['modern', 'classic', 'bold', 'minimal', 'neon']

  const currentStepIdx = STEPS.indexOf(step)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(8,8,15,0.8)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-ghost" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <ChevronLeft size={16} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#7c3aed" />
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>AI Video Creator</span>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                background: s === step
                  ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                  : i < currentStepIdx ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                color: s === step ? 'white' : i < currentStepIdx ? '#10b981' : '#52526a',
                border: `1px solid ${s === step ? 'rgba(124,58,237,0.5)' : i < currentStepIdx ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.3s'
              }}>
                {i < currentStepIdx ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 24, height: 2, borderRadius: 1, background: i < currentStepIdx ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.06)', transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '3rem 2rem', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">

          {/* ─── STEP 1: Prompt ─── */}
          {step === 'prompt' && (
            <motion.div key="prompt" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                  What video do you want to create?
                </h1>
                <p style={{ color: '#8b8b9e' }}>Describe your idea in detail — the more specific, the better!</p>
              </div>

              {/* Prompt textarea */}
              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="E.g. A cinematic documentary about how artificial intelligence is reshaping healthcare in developing countries, featuring real stories, expert interviews, and animated data visualizations..."
                  rows={6}
                  className="input"
                  style={{ resize: 'none', lineHeight: 1.6, paddingBottom: '3.5rem', fontSize: '0.95rem' }}
                />
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: prompt.length > 500 ? '#ef4444' : '#52526a' }}>
                    {prompt.length}/1000
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleVoiceInput}
                      className="btn-secondary"
                      style={{
                        padding: '0.4rem 0.875rem', fontSize: '0.8rem',
                        background: isListening ? 'rgba(239,68,68,0.15)' : undefined,
                        borderColor: isListening ? 'rgba(239,68,68,0.4)' : undefined
                      }}
                    >
                      {isListening ? <MicOff size={14} color="#ef4444" /> : <Mic size={14} />}
                      {isListening ? 'Stop' : 'Voice Input'}
                    </button>
                    {prompt && (
                      <button className="btn-ghost" onClick={() => setPrompt('')} style={{ padding: '0.4rem' }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Example prompts */}
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#8b8b9e', marginBottom: '0.75rem', fontWeight: 500 }}>
                  ✨ Click an example to use it:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {EXAMPLE_PROMPTS.map((ex, i) => (
                    <button
                      key={i}
                      className="tag-chip"
                      onClick={() => setPrompt(ex)}
                      style={{ fontSize: '0.78rem' }}
                    >
                      {ex.substring(0, 48)}…
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => {
                  if (!prompt.trim()) return toast.error('Enter a prompt first')
                  if (prompt.trim().length < 10) return toast.error('Prompt too short!')
                  setStep('settings')
                }}
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              >
                Continue to Settings <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {/* ─── STEP 2: Settings ─── */}
          {step === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
              <div style={{ marginBottom: '2rem' }}>
                <button className="btn-ghost" onClick={() => setStep('prompt')} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronLeft size={15} /> Back
                </button>
                <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                  Video Settings
                </h1>
                <p style={{ color: '#8b8b9e', fontSize: '0.875rem' }}>Customize how your video will look and sound</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Resolution */}
                <div className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Monitor size={16} color="#7c3aed" />
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>Resolution</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {RESOLUTION_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updateSetting('resolution', opt.value)}
                        style={{
                          padding: '0.875rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                          background: settings.resolution === opt.value ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                          outline: settings.resolution === opt.value ? '2px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.07)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#f0f0f5', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.7rem', color: settings.resolution === opt.value ? '#a855f7' : '#52526a' }}>{opt.badge}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Play size={16} color="#06b6d4" />
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>Aspect Ratio</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {ASPECT_RATIOS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updateSetting('aspectRatio', opt.value)}
                        style={{
                          padding: '1rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
                          background: settings.aspectRatio === opt.value ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
                          outline: settings.aspectRatio === opt.value ? '2px solid rgba(6,182,212,0.5)' : '1px solid rgba(255,255,255,0.07)',
                          transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                        }}
                      >
                        <opt.icon size={20} color={settings.aspectRatio === opt.value ? '#06b6d4' : '#52526a'} />
                        <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.9rem', color: '#f0f0f5' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.7rem', color: settings.aspectRatio === opt.value ? '#22d3ee' : '#52526a' }}>{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Clock size={16} color="#10b981" />
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>Duration</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    {DURATIONS.map(d => (
                      <button
                        key={d.value}
                        onClick={() => updateSetting('duration', d.value)}
                        style={{
                          padding: '0.5rem 1.125rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer',
                          background: settings.duration === d.value ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                          outline: settings.duration === d.value ? '2px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.07)',
                          color: settings.duration === d.value ? '#34d399' : '#8b8b9e',
                          fontWeight: settings.duration === d.value ? 700 : 400,
                          transition: 'all 0.2s', fontSize: '0.875rem', fontFamily: 'Space Grotesk'
                        }}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                  {settings.duration === 'custom' && (
                    <div style={{ marginTop: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        className="input"
                        type="number"
                        min="10"
                        max="600"
                        placeholder="Enter seconds (e.g. 120)"
                        value={settings.customDuration}
                        onChange={e => updateSetting('customDuration', e.target.value)}
                        style={{ maxWidth: 220 }}
                      />
                      <span style={{ color: '#8b8b9e', fontSize: '0.875rem' }}>seconds</span>
                    </div>
                  )}
                </div>

                {/* Voice & Style */}
                <div className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Volume2 size={16} color="#f59e0b" />
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>Voice & Style</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem' }}>AI Voice Gender</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['female', 'male'].map(v => (
                          <button
                            key={v}
                            onClick={() => updateSetting('voice', v)}
                            style={{
                              flex: 1, padding: '0.625rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                              background: settings.voice === v ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                              outline: settings.voice === v ? '2px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.07)',
                              color: settings.voice === v ? '#fbbf24' : '#8b8b9e',
                              fontSize: '0.8rem', fontWeight: settings.voice === v ? 700 : 400,
                              transition: 'all 0.2s', fontFamily: 'Space Grotesk'
                            }}
                          >
                            {v === 'female' ? '👩 Female' : '👨 Male'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem' }}>Animation Style</label>
                      <select className="input" value={settings.animationStyle} onChange={e => updateSetting('animationStyle', e.target.value)}>
                        {ANIMATION_STYLES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem' }}>Background Music</label>
                      <select className="input" value={settings.backgroundMusic} onChange={e => updateSetting('backgroundMusic', e.target.value)}>
                        {MUSIC_STYLES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem' }}>Subtitle Style</label>
                      <select className="input" value={settings.subtitleStyle} onChange={e => updateSetting('subtitleStyle', e.target.value)}>
                        {SUBTITLE_STYLES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Voiceover Settings */}
                <div className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Mic size={16} color="#a855f7" />
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>Voiceover Settings</h3>
                  </div>

                  {/* Mode Selector */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    {[
                      { key: 'tts', label: 'AI TTS' },
                      { key: 'upload', label: 'Audio File' },
                      { key: 'record', label: 'Mic Record' }
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setVoiceoverMode(opt.key)}
                        style={{
                          flex: 1, padding: '0.625rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                          background: voiceoverMode === opt.key ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
                          outline: voiceoverMode === opt.key ? '2px solid rgba(168,85,247,0.4)' : '1px solid rgba(255,255,255,0.07)',
                          color: voiceoverMode === opt.key ? '#c084fc' : '#8b8b9e',
                          fontSize: '0.8rem', fontWeight: voiceoverMode === opt.key ? 700 : 400,
                          transition: 'all 0.2s', fontFamily: 'Space Grotesk'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Mode-Specific Controls */}
                  {voiceoverMode === 'tts' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem' }}>TTS Voice Profile</label>
                        <select
                          className="input"
                          value={ttsProfile}
                          onChange={e => setTtsProfile(e.target.value)}
                          style={{ fontSize: '0.875rem' }}
                        >
                          <option value="storyteller">Modern Storyteller (Dynamic)</option>
                          <option value="corporate">Corporate Narrator (Professional)</option>
                          <option value="enthusiastic">Enthusiastic Promoter (High-Energy)</option>
                          <option value="chill">Chill Podcaster (Casual)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#8b8b9e', display: 'block', marginBottom: '0.4rem' }}>Narration Prompt/Script (Optional)</label>
                        <textarea
                          className="input"
                          rows={3}
                          placeholder="Type or paste a voiceover script for the AI to read, or leave blank to auto-generate..."
                          value={ttsScriptPrompt}
                          onChange={e => setTtsScriptPrompt(e.target.value)}
                          style={{ resize: 'none', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>
                  )}

                  {voiceoverMode === 'upload' && (
                    <div
                      style={{
                        border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '0.75rem',
                        padding: '1.5rem', textAlign: 'center', cursor: 'pointer', position: 'relative'
                      }}
                    >
                      {voiceoverFile ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={18} color="#10b981" />
                          <span style={{ fontSize: '0.875rem', color: '#10b981' }}>{voiceoverFile.name}</span>
                          <button
                            onClick={e => { e.stopPropagation(); setVoiceoverFile(null) }}
                            className="btn-ghost"
                            style={{ padding: '2px' }}
                          >
                            <X size={13} color="#ef4444" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload size={24} color="#52526a" style={{ marginBottom: '0.5rem', margin: '0 auto' }} />
                          <p style={{ fontSize: '0.875rem', color: '#8b8b9e' }}>Click to upload custom voiceover (.mp3, .wav, .m4a)</p>
                        </>
                      )}
                      <input
                        type="file"
                        accept="audio/*"
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                        onChange={e => setVoiceoverFile(e.target.files[0] || null)}
                      />
                    </div>
                  )}

                  {voiceoverMode === 'record' && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isRecordingVoice ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="pulse-dot" style={{ background: '#ef4444' }} />
                            <span style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 600 }}>Recording: {recordingSeconds}s</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.9rem', color: '#8b8b9e' }}>
                            {recordedBlobUrl ? '✅ Voiceover Recorded' : 'Ready to record'}
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        {isRecordingVoice ? (
                          <button className="btn-primary" style={{ flex: 1, fontSize: '0.75rem', background: '#ef4444', border: 'none' }} onClick={stopVoiceRecording}>
                            Stop Recording
                          </button>
                        ) : (
                          <button className="btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }} onClick={startVoiceRecording}>
                            🎙️ Start Voice Record
                          </button>
                        )}
                        {recordedBlobUrl && !isRecordingVoice && (
                          <button
                            className="btn-danger"
                            onClick={() => setRecordedBlobUrl(null)}
                            style={{ padding: '0.5rem' }}
                            title="Delete recording"
                          >
                            <X size={15} />
                          </button>
                        )}
                      </div>
                      {recordedBlobUrl && !isRecordingVoice && (
                        <audio src={recordedBlobUrl} controls style={{ width: '100%', height: '32px', marginTop: '0.5rem' }} />
                      )}
                    </div>
                  )}
                </div>

                {/* Branding */}
                <div className="glass" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Upload size={16} color="#ec4899" />
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>Branding (Optional)</h3>
                  </div>
                  <div
                    onClick={() => logoInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${logoFile ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.2s', background: logoFile ? 'rgba(124,58,237,0.08)' : 'transparent'
                    }}
                  >
                    {logoFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={18} color="#10b981" />
                        <span style={{ fontSize: '0.875rem', color: '#10b981' }}>{logoFile.name}</span>
                        <button
                          onClick={e => { e.stopPropagation(); setLogoFile(null) }}
                          className="btn-ghost"
                          style={{ padding: '2px' }}
                        >
                          <X size={13} color="#ef4444" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} color="#52526a" style={{ marginBottom: '0.5rem' }} />
                        <p style={{ fontSize: '0.875rem', color: '#8b8b9e' }}>Upload logo (PNG, SVG, JPG — max 5 MB)</p>
                      </>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => setLogoFile(e.target.files[0] || null)}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Remove watermark</span>
                      <p style={{ fontSize: '0.75rem', color: '#52526a', marginTop: 2 }}>Toggle off to include VisionFlow branding</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={!settings.watermark}
                        onChange={e => updateSetting('watermark', !e.target.checked)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button className="btn-secondary" onClick={() => setStep('prompt')} style={{ padding: '0.9rem 1.5rem' }}>
                  <ChevronLeft size={16} /> Back
                </button>
                <button className="btn-primary" onClick={handleGenerate} style={{ flex: 1, padding: '0.9rem', fontSize: '1rem' }}>
                  <Wand2 size={18} /> Generate Video with AI
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Generating ─── */}
          {step === 'generating' && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PipelineView
                videoId={generatingVideoId}
                onComplete={handlePipelineComplete}
              />
            </motion.div>
          )}

          {/* ─── STEP 4: Done ─── */}
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', maxWidth: 550, margin: '0 auto' }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ marginBottom: '1.5rem' }}
              >
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                  boxShadow: '0 0 30px rgba(16,185,129,0.2)'
                }}>
                  <CheckCircle2 size={40} color="#10b981" />
                </div>
              </motion.div>
              <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', marginBottom: '0.75rem' }}>
                Your Video is Ready! 🎉
              </h2>
              <p style={{ color: '#8b8b9e', marginBottom: '0.5rem' }}>
                AI has generated your video with {completedVideo?.scenes?.length || 5} scenes,
              </p>
              <p style={{ color: '#8b8b9e', marginBottom: '2rem' }}>
                voiceover, background music, and auto-subtitles.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/editor/${completedVideo?._id || 'demo'}`)}
                  style={{ padding: '1rem', fontSize: '1rem' }}
                >
                  <Film size={18} /> Open in Editor & Export
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => { setStep('prompt'); setPrompt(''); setCompletedVideo(null) }}
                  style={{ padding: '0.875rem' }}
                >
                  <RotateCcw size={16} /> Create Another Video
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
