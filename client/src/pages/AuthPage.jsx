import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Zap } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      let res
      if (mode === 'login') {
        res = await authAPI.login({ email: form.email, password: form.password })
      } else {
        if (!form.name) return toast.error('Name is required')
        res = await authAPI.register({ name: form.name, email: form.email, password: form.password })
      }
      login(res.data.user, res.data.token)
      toast.success(mode === 'login' ? 'Welcome back! 🎉' : 'Account created! 🚀')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    login({
      _id: 'demo', name: 'Demo User', email: 'demo@visionflow.ai', plan: 'pro', videosGenerated: 12
    }, 'demo-token')
    toast.success('Logged in as Demo User!')
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '14px', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(124,58,237,0.4)'
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ color: '#8b8b9e', fontSize: '0.875rem' }}>
            {mode === 'login' ? 'Sign in to your VisionFlow AI account' : 'Start creating AI videos for free'}
          </p>
        </div>

        {/* Form card */}
        <div className="glass" style={{ padding: '2rem' }}>
          {/* Tab switcher */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
            background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem',
            padding: 4, marginBottom: '1.5rem'
          }}>
            {['login', 'register'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '0.6rem', borderRadius: '0.6rem', border: 'none',
                  background: mode === m ? 'rgba(124,58,237,0.3)' : 'transparent',
                  color: mode === m ? '#c4b5fd' : '#8b8b9e',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'Space Grotesk'
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b8b9e', marginBottom: '0.4rem', fontWeight: 500 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="#52526a" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      className="input"
                      style={{ paddingLeft: '2.25rem' }}
                      placeholder="John Doe"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b8b9e', marginBottom: '0.4rem', fontWeight: 500 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} color="#52526a" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input"
                  type="email"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8b8b9e', marginBottom: '0.4rem', fontWeight: 500 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="#52526a" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input"
                  type={showPass ? 'text' : 'password'}
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={15} color="#52526a" /> : <Eye size={15} color="#52526a" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? (
                <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} /> Processing...</>
              ) : (
                <><Sparkles size={16} /> {mode === 'login' ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          <div className="divider" />

          <button
            className="btn-secondary"
            onClick={handleDemo}
            style={{ width: '100%', padding: '0.85rem', background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.3)', color: '#c4b5fd' }}
          >
            <Zap size={16} /> Try Demo (No Sign-Up Required)
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', margin: '1.5rem auto 0', fontSize: '0.8rem' }}
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  )
}
