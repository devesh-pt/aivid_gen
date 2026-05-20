import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, Play, Zap, Globe, Download, Shield,
  Star, ArrowRight, Video, Mic, Music, Subtitles,
  Film, Layers, TrendingUp, Check, ChevronRight
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } }
}

const FEATURES = [
  { icon: Sparkles, title: 'AI Script Generation', desc: 'GPT-powered scripts with hooks, scenes, and CTAs automatically crafted for your topic.', color: '#7c3aed' },
  { icon: Film, title: 'Cinematic Visuals', desc: 'Stunning AI-generated visuals with professional color grading and dynamic camera movements.', color: '#06b6d4' },
  { icon: Mic, title: 'Realistic Voiceover', desc: 'Choose from 50+ AI voices — male, female, accents — that sound indistinguishably human.', color: '#10b981' },
  { icon: Music, title: 'Background Music & SFX', desc: 'Royalty-free music and sound effects automatically synced to your video\'s mood and pacing.', color: '#f59e0b' },
  { icon: Subtitles, title: 'Auto Subtitles', desc: 'Beautifully styled, perfectly timed subtitles for maximum engagement and accessibility.', color: '#ec4899' },
  { icon: Download, title: 'HD/4K Export', desc: 'Export in 720p, 1080p, or 4K with compression options and platform-specific presets.', color: '#7c3aed' },
]

const STATS = [
  { value: '2.4M+', label: 'Videos Created' },
  { value: '4K', label: 'Max Resolution' },
  { value: '50+', label: 'AI Voices' },
  { value: '<3min', label: 'Avg. Generation' },
]

const PLANS = [
  {
    name: 'Free', price: '$0', period: '/mo', color: 'rgba(255,255,255,0.05)',
    features: ['5 videos/month', '720p quality', '30-sec max duration', 'Watermarked', 'Basic templates'],
    cta: 'Get Started Free', popular: false
  },
  {
    name: 'Pro', price: '$29', period: '/mo', color: 'rgba(124,58,237,0.12)',
    features: ['Unlimited videos', '4K quality', '10-min max duration', 'No watermark', '100+ templates', 'Custom voices', 'Priority queue'],
    cta: 'Start Pro Trial', popular: true
  },
  {
    name: 'Enterprise', price: '$99', period: '/mo', color: 'rgba(6,182,212,0.08)',
    features: ['Everything in Pro', 'API access', 'Team collaboration', 'White-label export', 'Custom branding', 'Dedicated support', 'SLA guarantee'],
    cta: 'Contact Sales', popular: false
  },
]

const EXAMPLES = [
  'A documentary about the future of AI and robotics in 2040',
  'A product launch video for a new electric car',
  'A motivational video about entrepreneurship and success',
  'A travel guide exploring the hidden gems of Japan',
  'A cooking tutorial for healthy Mediterranean recipes',
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 2rem', position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(8,8,15,0.8)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
            VisionFlow <span className="gradient-text">AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn-ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="btn-ghost" onClick={() => navigate('/templates')}>Templates</button>
          <button className="btn-secondary" onClick={() => navigate('/auth')} style={{ padding: '0.5rem 1.25rem' }}>
            Sign In
          </button>
          <button className="btn-primary" onClick={() => navigate('/create')} style={{ padding: '0.5rem 1.25rem' }}>
            Create Video <ArrowRight size={15} />
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section style={{ padding: '5rem 2rem 4rem', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}>
            <span className="badge badge-purple" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              <Zap size={11} /> New: 4K Ultra HD Generation
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontFamily: 'Space Grotesk', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem'
          }}>
            Turn Any Idea Into{' '}
            <span className="gradient-text">Stunning Videos</span>{' '}
            with AI
          </motion.h1>

          <motion.p variants={fadeUp} style={{
            fontSize: '1.2rem', color: '#8b8b9e', lineHeight: 1.7,
            maxWidth: 620, margin: '0 auto 2.5rem'
          }}>
            Type a prompt. Choose your settings. VisionFlow AI handles everything —
            script, visuals, voiceover, music, subtitles — delivering broadcast-quality
            videos for YouTube, Shorts, Reels, and more.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/create')} style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <Sparkles size={18} /> Start Creating Free
            </button>
            <button className="btn-secondary" onClick={() => navigate('/templates')} style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <Play size={16} /> Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Hero video preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginTop: '4rem', position: 'relative' }}
        >
          <div style={{
            borderRadius: '1.5rem', overflow: 'hidden',
            border: '1px solid rgba(124,58,237,0.3)',
            boxShadow: '0 40px 100px rgba(124,58,237,0.2), 0 0 0 1px rgba(255,255,255,0.05)',
            background: 'rgba(12,12,22,0.9)', backdropFilter: 'blur(20px)',
            aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden'
          }}>
            <img
              src="https://picsum.photos/seed/hero/1200/675"
              alt="VisionFlow AI Demo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(6,182,212,0.2) 100%)'
            }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Play size={28} fill="white" color="white" style={{ marginLeft: 3 }} />
              </motion.div>
              <div className="badge badge-cyan">AI Generated Video</div>
            </div>
            {/* Pipeline overlay */}
            <div style={{
              position: 'absolute', bottom: 16, left: 16, right: 16,
              display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6
            }}>
              {['Script', 'Visuals', 'Voice', 'Music', 'Export'].map((s, i) => (
                <div key={s} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '4px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#8b8b9e', marginBottom: 3 }}>{s}</div>
                  <div className="progress-track" style={{ height: 3 }}>
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 0.8 + i * 0.2, duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px',
            background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} style={{
              padding: '1.5rem', textAlign: 'center',
              background: 'rgba(8,8,15,0.6)', backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', fontWeight: 800 }} className="gradient-text">{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#8b8b9e', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <motion.div variants={fadeUp} className="badge badge-purple" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            <Layers size={11} /> Complete AI Pipeline
          </motion.div>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'Space Grotesk', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Everything You Need to Go Viral
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#8b8b9e', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
            VisionFlow AI automates every step of professional video production in one seamless pipeline.
          </motion.p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass glass-hover"
              style={{ padding: '1.75rem' }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '12px', marginBottom: '1rem',
                background: `${feature.color}20`,
                border: `1px solid ${feature.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <feature.icon size={22} color={feature.color} />
              </div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ color: '#8b8b9e', fontSize: '0.875rem', lineHeight: 1.6 }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Example prompts */}
      <section style={{ padding: '3rem 2rem', maxWidth: 1000, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.08) 100%)',
            border: '1px solid rgba(124,58,237,0.2)', borderRadius: '1.5rem', padding: '2.5rem'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', marginBottom: '0.5rem' }}>Try These Prompts</h2>
            <p style={{ color: '#8b8b9e' }}>Click any example to start creating instantly</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {EXAMPLES.map((example, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 8 }}
                onClick={() => navigate('/create', { state: { prompt: example } })}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', color: '#f0f0f5',
                  fontFamily: 'Inter'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>#{i + 1}</span>
                  <span style={{ fontSize: '0.9rem' }}>{example}</span>
                </div>
                <ChevronRight size={16} color="#7c3aed" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '5rem 2rem', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontFamily: 'Space Grotesk', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: '#8b8b9e', fontSize: '1rem' }}>No hidden fees. Cancel anytime.</motion.p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: plan.color, backdropFilter: 'blur(16px)',
                border: plan.popular ? '1px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '1.25rem', padding: '2rem', position: 'relative',
                boxShadow: plan.popular ? '0 0 40px rgba(124,58,237,0.2)' : 'none'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  padding: '4px 16px', borderRadius: '999px', fontSize: '0.75rem',
                  fontWeight: 700, fontFamily: 'Space Grotesk', whiteSpace: 'nowrap'
                }}>
                  ⭐ Most Popular
                </div>
              )}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#8b8b9e', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{plan.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  <span style={{ fontSize: '2.5rem', fontFamily: 'Space Grotesk', fontWeight: 800 }}>{plan.price}</span>
                  <span style={{ color: '#8b8b9e', fontSize: '0.9rem' }}>{plan.period}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem' }}>
                    <Check size={14} color="#10b981" />
                    <span style={{ color: '#d0d0df' }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                className={plan.popular ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%' }}
                onClick={() => navigate('/auth')}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '4rem 2rem', maxWidth: 800, margin: '0 auto 4rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '2rem', padding: '3.5rem 2rem', textAlign: 'center',
            boxShadow: '0 0 60px rgba(124,58,237,0.15)'
          }}
        >
          <TrendingUp size={40} color="#7c3aed" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontFamily: 'Space Grotesk', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to Create Your First AI Video?
          </h2>
          <p style={{ color: '#8b8b9e', marginBottom: '2rem', fontSize: '1rem' }}>
            Join 2.4 million creators. No credit card required.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/create')} style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
              <Sparkles size={18} /> Create Video Now
            </button>
            <button className="btn-secondary" onClick={() => navigate('/templates')} style={{ padding: '0.9rem 2rem' }}>
              Browse Templates
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '2rem', textAlign: 'center', color: '#52526a', fontSize: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: 24, height: 24, borderRadius: '6px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={12} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: '#8b8b9e' }}>VisionFlow AI</span>
        </div>
        <p>© 2025 VisionFlow AI. All rights reserved. Built with ❤️ and artificial intelligence.</p>
      </footer>
    </div>
  )
}
