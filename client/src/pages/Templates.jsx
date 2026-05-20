import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Search, Filter, Sparkles, Star, TrendingUp, Play, ArrowRight, Zap } from 'lucide-react'

const CATEGORIES = ['All', 'YouTube', 'Shorts', 'Reels', 'Marketing', 'Education', 'Travel', 'Gaming', 'Fashion', 'Food']

const TEMPLATES = [
  { id: 1, name: 'YouTube Explainer', category: 'YouTube', duration: '5min', resolution: '4K', img: 'https://picsum.photos/seed/t1/400/225', desc: 'Professional explainer video with animated graphics', popular: true, aspectRatio: '16:9' },
  { id: 2, name: 'Instagram Reel Story', category: 'Reels', duration: '30sec', resolution: '1080p', img: 'https://picsum.photos/seed/t2/225/400', desc: 'Vertical reel with trending transitions and effects', popular: true, aspectRatio: '9:16' },
  { id: 3, name: 'Product Launch', category: 'Marketing', duration: '1min', resolution: '4K', img: 'https://picsum.photos/seed/t3/400/225', desc: 'Premium product showcase with cinematic reveals', popular: false, aspectRatio: '16:9' },
  { id: 4, name: 'Travel Vlog', category: 'Travel', duration: '5min', resolution: '4K', img: 'https://picsum.photos/seed/t4/400/225', desc: 'Cinematic travel documentary with drone-style shots', popular: true, aspectRatio: '16:9' },
  { id: 5, name: 'Short Tutorial', category: 'Education', duration: '1min', resolution: '1080p', img: 'https://picsum.photos/seed/t5/225/400', desc: 'Step-by-step tutorial with screen recording overlay', popular: false, aspectRatio: '9:16' },
  { id: 6, name: 'Gaming Highlights', category: 'Gaming', duration: '1min', resolution: '1080p', img: 'https://picsum.photos/seed/t6/400/225', desc: 'Action-packed gaming montage with dynamic effects', popular: true, aspectRatio: '16:9' },
  { id: 7, name: 'Corporate Promo', category: 'Marketing', duration: '5min', resolution: '4K', img: 'https://picsum.photos/seed/t7/400/225', desc: 'Professional business presentation with clean design', popular: false, aspectRatio: '16:9' },
  { id: 8, name: 'Food Recipe Reel', category: 'Food', duration: '30sec', resolution: '1080p', img: 'https://picsum.photos/seed/t8/225/400', desc: 'Mouth-watering recipe showcase with close-up shots', popular: true, aspectRatio: '9:16' },
  { id: 9, name: 'Fashion Lookbook', category: 'Fashion', duration: '1min', resolution: '4K', img: 'https://picsum.photos/seed/t9/400/225', desc: 'High-fashion editorial with smooth transitions', popular: false, aspectRatio: '16:9' },
  { id: 10, name: 'YouTube Short', category: 'Shorts', duration: '30sec', resolution: '1080p', img: 'https://picsum.photos/seed/t10/225/400', desc: 'Viral-ready short with hook and trending audio', popular: true, aspectRatio: '9:16' },
  { id: 11, name: 'Documentary Style', category: 'YouTube', duration: '10min', resolution: '4K', img: 'https://picsum.photos/seed/t11/400/225', desc: 'Professional documentary narration with b-roll', popular: false, aspectRatio: '16:9' },
  { id: 12, name: 'Motivational Story', category: 'YouTube', duration: '5min', resolution: '1080p', img: 'https://picsum.photos/seed/t12/400/225', desc: 'Inspiring personal story with emotional music', popular: true, aspectRatio: '16:9' },
]

export default function Templates() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState(null)

  const filtered = TEMPLATES.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 4rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(8,8,15,0.8)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-ghost" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
            <ChevronLeft size={16} /> Back
          </button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#7c3aed" />
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700 }}>Trending Templates</span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate('/create')} style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
          <Zap size={15} /> Create Custom Video
        </button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span className="badge badge-purple" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            <TrendingUp size={11} /> 100+ Templates
          </span>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Start from a <span className="gradient-text">Trending Template</span>
          </h1>
          <p style={{ color: '#8b8b9e', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
            Pick a template, customize it with AI, and publish in minutes.
          </p>
        </motion.div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto 2rem' }}>
          <Search size={16} color="#52526a" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            className="input"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
                background: activeCategory === cat ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.05)',
                color: activeCategory === cat ? 'white' : '#8b8b9e',
                fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.15s', fontFamily: 'Space Grotesk'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div style={{ columns: '2 300px', gap: '1.25rem' }}>
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onMouseEnter={() => setHoveredId(template.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                borderRadius: '1rem', overflow: 'hidden', marginBottom: '1.25rem',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)', cursor: 'pointer',
                transition: 'all 0.2s', breakInside: 'avoid',
                transform: hoveredId === template.id ? 'translateY(-4px)' : 'none',
                boxShadow: hoveredId === template.id ? '0 20px 40px rgba(0,0,0,0.3)' : 'none'
              }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img
                  src={template.img}
                  alt={template.name}
                  style={{
                    width: '100%', objectFit: 'cover', display: 'block',
                    aspectRatio: template.aspectRatio === '9:16' ? '9/16' : '16/9',
                    transition: 'transform 0.3s',
                    transform: hoveredId === template.id ? 'scale(1.04)' : 'scale(1)'
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />

                {/* Overlay on hover */}
                <motion.div
                  animate={{ opacity: hoveredId === template.id ? 1 : 0 }}
                  style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                >
                  <button
                    className="btn-primary"
                    onClick={() => navigate('/create', { state: { template } })}
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    <Sparkles size={15} /> Use Template
                  </button>
                  <button className="btn-secondary" style={{ padding: '0.6rem', fontSize: '0.85rem' }}>
                    <Play size={15} />
                  </button>
                </motion.div>

                {/* Badges */}
                <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: '6px' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{template.category}</span>
                  {template.popular && <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}><Star size={9} fill="currentColor" /> Popular</span>}
                </div>

                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: '4px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.6rem' }}>{template.resolution}</span>
                  <span style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.6rem', color: '#8b8b9e', display: 'flex', alignItems: 'center' }}>{template.duration}</span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem' }}>{template.name}</h3>
                  <span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '999px', fontSize: '0.65rem', color: '#8b8b9e', flexShrink: 0 }}>{template.aspectRatio}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#8b8b9e', lineHeight: 1.5, marginBottom: '0.875rem' }}>{template.desc}</p>
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/create', { state: { template } })}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem' }}
                >
                  Use This Template <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#52526a' }}>
            <Search size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No templates found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
