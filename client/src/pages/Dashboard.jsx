import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Plus, Video, Clock, HardDrive, TrendingUp,
  MoreVertical, Trash2, Edit3, Download, Eye, Sparkles,
  Play, Film, Zap, ChevronRight, Star, LogOut, Settings, User
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useVideoStore } from '../store/videoStore'
import { videoAPI } from '../services/api'
import toast from 'react-hot-toast'

const DEMO_VIDEOS = [
  { _id: '1', title: 'The Future of AI in 2025', prompt: 'A documentary about AI and robotics', status: 'completed', settings: { resolution: '4K', aspectRatio: '16:9', duration: '5min' }, createdAt: new Date(Date.now() - 86400000 * 2), thumbnail: 'https://picsum.photos/seed/v1/400/225' },
  { _id: '2', title: 'Electric Cars Revolution', prompt: 'Product launch video for electric car', status: 'completed', settings: { resolution: '1080p', aspectRatio: '16:9', duration: '1min' }, createdAt: new Date(Date.now() - 86400000 * 3), thumbnail: 'https://picsum.photos/seed/v2/400/225' },
  { _id: '3', title: 'Meditation for Beginners', prompt: 'A calming mindfulness guide', status: 'completed', settings: { resolution: '1080p', aspectRatio: '9:16', duration: '30sec' }, createdAt: new Date(Date.now() - 86400000), thumbnail: 'https://picsum.photos/seed/v3/400/225' },
  { _id: '4', title: 'Tokyo Travel Guide 2025', prompt: 'Travel guide exploring hidden gems of Japan', status: 'generating', settings: { resolution: '4K', aspectRatio: '16:9', duration: '5min' }, createdAt: new Date(), thumbnail: 'https://picsum.photos/seed/v4/400/225' },
]

const STATS = [
  { icon: Video, label: 'Videos Created', value: '12', change: '+3 this week', color: '#7c3aed' },
  { icon: HardDrive, label: 'Storage Used', value: '2.4 GB', change: 'of 10 GB', color: '#06b6d4' },
  { icon: Clock, label: 'Total Duration', value: '47 min', change: 'generated', color: '#10b981' },
  { icon: TrendingUp, label: 'Exports', value: '8', change: 'MP4 downloads', color: '#f59e0b' },
]

const TEMPLATES_PREVIEW = [
  { name: 'YouTube Explainer', category: 'YouTube', img: 'https://picsum.photos/seed/t1/300/170' },
  { name: 'Instagram Reel', category: 'Reels', img: 'https://picsum.photos/seed/t2/300/170' },
  { name: 'Product Demo', category: 'Marketing', img: 'https://picsum.photos/seed/t3/300/170' },
]

function Sidebar({ navigate, logout }) {
  const { user } = useAuthStore()
  const [open, setOpen] = useState(false)
  const links = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: Plus, label: 'Create Video', path: '/create' },
    { icon: Film, label: 'Templates', path: '/templates' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <aside style={{
      width: 240, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column',
      background: 'rgba(8,8,15,0.8)', backdropFilter: 'blur(20px)', zIndex: 40
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={15} color="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem' }}>VisionFlow <span className="gradient-text">AI</span></span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {links.map(({ icon: Icon, label, path, active }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 0.875rem', borderRadius: '0.625rem', border: 'none',
              background: active ? 'rgba(124,58,237,0.15)' : 'transparent',
              color: active ? '#c4b5fd' : '#8b8b9e',
              cursor: 'pointer', textAlign: 'left', width: '100%',
              fontSize: '0.875rem', fontWeight: active ? 600 : 400,
              transition: 'all 0.15s', fontFamily: 'Inter'
            }}
          >
            <Icon size={17} />
            {label}
            {active && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }} />}
          </button>
        ))}

        <div className="divider" />

        <button
          className="btn-primary"
          onClick={() => navigate('/create')}
          style={{ width: '100%', padding: '0.65rem' }}
        >
          <Plus size={16} /> New Video
        </button>
      </nav>

      {/* User */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', borderRadius: '0.625rem', background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={16} color="white" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Demo User'}</div>
            <div style={{ fontSize: '0.7rem', color: '#8b8b9e' }}>{user?.plan || 'pro'} plan</div>
          </div>
          <button onClick={logout} className="btn-ghost" style={{ padding: '4px', minWidth: 0 }} title="Logout">
            <LogOut size={14} color="#8b8b9e" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { videos, setVideos } = useVideoStore()
  const [displayVideos, setDisplayVideos] = useState(DEMO_VIDEOS)
  const [menuOpen, setMenuOpen] = useState(null)

  useEffect(() => {
    videoAPI.list().then(r => {
      if (r.data.length > 0) setDisplayVideos(r.data)
    }).catch(() => setDisplayVideos(DEMO_VIDEOS))
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleDelete = (id) => {
    setDisplayVideos(prev => prev.filter(v => v._id !== id))
    toast.success('Video deleted')
    setMenuOpen(null)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar navigate={navigate} logout={handleLogout} />

      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.7rem', letterSpacing: '-0.02em', marginBottom: '0.2rem' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Creator'} 👋
            </h1>
            <p style={{ color: '#8b8b9e', fontSize: '0.875rem' }}>Here's what's happening with your videos today</p>
          </motion.div>
          <button className="btn-primary" onClick={() => navigate('/create')}>
            <Plus size={16} /> Create Video
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass glass-hover"
              style={{ padding: '1.25rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ width: 38, height: 38, borderRadius: '10px', background: `${stat.color}15`, border: `1px solid ${stat.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontFamily: 'Space Grotesk', fontWeight: 800, marginBottom: '0.2rem' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#8b8b9e' }}>{stat.label}</div>
              <div style={{ fontSize: '0.7rem', color: stat.color, marginTop: '0.25rem' }}>{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/create')}
            style={{
              padding: '1.5rem', borderRadius: '1rem', border: 'none', cursor: 'pointer', textAlign: 'left',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(6,182,212,0.15) 100%)',
              borderColor: 'rgba(124,58,237,0.3)', outline: '1px solid rgba(124,58,237,0.25)'
            }}
          >
            <Sparkles size={24} color="#a855f7" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: '0.3rem', color: '#f0f0f5' }}>AI Video Creator</div>
            <div style={{ fontSize: '0.8rem', color: '#8b8b9e' }}>Enter a prompt, let AI do the rest</div>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/templates')}
            style={{
              padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.07)',
              cursor: 'pointer', textAlign: 'left', background: 'rgba(255,255,255,0.04)'
            }}
          >
            <Film size={24} color="#06b6d4" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginBottom: '0.3rem', color: '#f0f0f5' }}>Use Template</div>
            <div style={{ fontSize: '0.8rem', color: '#8b8b9e' }}>Start from a trending template</div>
          </motion.button>
        </div>

        {/* Recent Videos */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem' }}>Recent Videos</h2>
            <button className="btn-ghost" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {displayVideos.map((video, i) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass glass-hover"
                style={{ overflow: 'hidden', position: 'relative' }}
              >
                {/* Thumbnail */}
                <div 
                  onClick={() => video.status === 'completed' && navigate(`/editor/${video._id}`)}
                  style={{ position: 'relative', aspectRatio: '16/9', background: '#12121f', overflow: 'hidden', cursor: video.status === 'completed' ? 'pointer' : 'default' }}
                >
                  <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />

                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: 8, left: 8 }}>
                    {video.status === 'generating' ? (
                      <span className="badge badge-orange">
                        <span className="pulse-dot" style={{ width: 6, height: 6 }} /> Generating
                      </span>
                    ) : (
                      <span className="badge badge-green">✓ Ready</span>
                    )}
                  </div>

                  {/* Resolution */}
                  <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                    <span className="badge badge-purple">{video.settings?.resolution}</span>
                  </div>

                  {/* Play overlay */}
                  {video.status === 'completed' && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                      className="play-overlay"
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={20} fill="white" color="white" style={{ marginLeft: 2 }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4, flex: 1 }}>{video.title}</h3>
                    <div style={{ position: 'relative' }}>
                      <button
                        className="btn-ghost"
                        style={{ padding: '4px' }}
                        onClick={() => setMenuOpen(menuOpen === video._id ? null : video._id)}
                      >
                        <MoreVertical size={15} />
                      </button>
                      {menuOpen === video._id && (
                        <div className="glass" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 50, minWidth: 160, overflow: 'hidden', padding: '0.375rem' }}>
                          <button onClick={() => navigate(`/editor/${video._id}`)} className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                            <Edit3 size={13} /> Edit Video
                          </button>
                          <button className="btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                            <Download size={13} /> Download
                          </button>
                          <button onClick={() => handleDelete(video._id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.8rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: '0.375rem' }}>
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', color: '#52526a' }}>{video.settings?.aspectRatio}</span>
                    <span style={{ fontSize: '0.7rem', color: '#52526a' }}>·</span>
                    <span style={{ fontSize: '0.7rem', color: '#52526a' }}>{video.settings?.duration}</span>
                    <span style={{ fontSize: '0.7rem', color: '#52526a' }}>·</span>
                    <span style={{ fontSize: '0.7rem', color: '#52526a' }}>{formatDate(video.createdAt)}</span>
                  </div>

                  {video.status === 'completed' && (
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/editor/${video._id}`)}
                      style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem', fontSize: '0.8rem' }}
                    >
                      <Edit3 size={13} /> Open Editor
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Create new card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: displayVideos.length * 0.08 }}
              onClick={() => navigate('/create')}
              style={{
                borderRadius: '1rem', border: '2px dashed rgba(124,58,237,0.3)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', aspectRatio: '4/3', gap: '0.75rem',
                transition: 'all 0.2s', minHeight: 200, background: 'rgba(124,58,237,0.03)'
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={22} color="#7c3aed" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#c4b5fd', marginBottom: '0.2rem' }}>Create New Video</div>
                <div style={{ fontSize: '0.75rem', color: '#52526a' }}>AI-powered generation</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Templates preview */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1.1rem' }}>Trending Templates</h2>
            <button className="btn-ghost" onClick={() => navigate('/templates')} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Browse all <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {TEMPLATES_PREVIEW.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/templates')}
                style={{ borderRadius: '0.875rem', overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <img src={t.img} alt={t.name} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t.name}</div>
                  <span className="badge badge-purple" style={{ fontSize: '0.65rem', marginTop: 4 }}>{t.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
