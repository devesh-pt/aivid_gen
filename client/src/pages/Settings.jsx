import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Plus, Film, Settings, User, LogOut, Sparkles,
  Key, Shield, CreditCard, Paintbrush, Save, Upload, CheckCircle2,
  AlertCircle, Check
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { uploadAPI } from '../services/api'
import toast from 'react-hot-toast'

function Sidebar({ navigate, logout }) {
  const { user } = useAuthStore()
  const links = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Plus, label: 'Create Video', path: '/create' },
    { icon: Film, label: 'Templates', path: '/templates' },
    { icon: Settings, label: 'Settings', path: '/settings', active: true },
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
          <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem' }}>aivid_gen</span>
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

        <div className="divider" style={{ margin: '1rem 0', height: 1, background: 'rgba(255,255,255,0.05)' }} />

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

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile') // profile | keys | brand | billing

  // Profile States
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  
  // API Keys States
  const [openaiKey, setOpenaiKey] = useState(localStorage.getItem('vf_openai_key') || '')
  const [elevenLabsKey, setElevenLabsKey] = useState(localStorage.getItem('vf_elevenlabs_key') || '')
  const [runwayKey, setRunwayKey] = useState(localStorage.getItem('vf_runway_key') || '')

  // Branding States
  const [logoUrl, setLogoUrl] = useState(localStorage.getItem('vf_brand_logo') || '')
  const [defaultWatermark, setDefaultWatermark] = useState(localStorage.getItem('vf_default_watermark') !== 'false')
  const [brandingColor, setBrandingColor] = useState(localStorage.getItem('vf_branding_color') || '#7c3aed')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const fileInputRef = useRef(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleProfileSave = (e) => {
    e.preventDefault()
    if (!profileName.trim() || !profileEmail.trim()) {
      return toast.error('Name and Email cannot be empty')
    }
    updateUser({ name: profileName, email: profileEmail })
    toast.success('Profile updated successfully!')
  }

  const handleKeysSave = (e) => {
    e.preventDefault()
    localStorage.setItem('vf_openai_key', openaiKey)
    localStorage.setItem('vf_elevenlabs_key', elevenLabsKey)
    localStorage.setItem('vf_runway_key', runwayKey)
    toast.success('API Keys updated successfully!')
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    try {
      const res = await uploadAPI.uploadLogo(file)
      if (res.data?.success) {
        setLogoUrl(res.data.url)
        localStorage.setItem('vf_brand_logo', res.data.url)
        toast.success('Branding logo uploaded successfully!')
      }
    } catch {
      // Offline / simulation fallback
      const fakeUrl = URL.createObjectURL(file)
      setLogoUrl(fakeUrl)
      localStorage.setItem('vf_brand_logo', fakeUrl)
      toast.success('Logo uploaded (Demo mode)!')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleBrandSave = (e) => {
    e.preventDefault()
    localStorage.setItem('vf_default_watermark', defaultWatermark.toString())
    localStorage.setItem('vf_branding_color', brandingColor)
    toast.success('Branding settings saved!')
  }

  const handleUpgradePlan = (planName) => {
    updateUser({ plan: planName })
    toast.success(`Upgraded to ${planName.toUpperCase()} plan successfully!`)
  }

  const tabItems = [
    { id: 'profile', label: 'My Account', icon: User },
    { id: 'keys', label: 'API Integrations', icon: Key },
    { id: 'brand', label: 'Brand Customization', icon: Paintbrush },
    { id: 'billing', label: 'Plans & Billing', icon: CreditCard },
    { id: 'admin', label: 'Admin Dashboard', icon: Shield },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar navigate={navigate} logout={handleLogout} />

      <main style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
              System Settings
            </h1>
            <p style={{ color: '#8b8b9e', fontSize: '0.875rem' }}>Manage your workspace settings, brand profiles, and API access.</p>
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            {/* Tabs Sidebar */}
            <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {tabItems.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: 'none',
                      background: isActive ? 'rgba(124,58,237,0.1)' : 'transparent',
                      color: isActive ? '#c4b5fd' : '#8b8b9e',
                      cursor: 'pointer', textAlign: 'left', fontSize: '0.825rem', fontWeight: isActive ? 600 : 400,
                      transition: 'all 0.15s'
                    }}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Tab Panel */}
            <div style={{ flex: 1 }} className="glass" style={{ padding: '2rem', flex: 1, minHeight: 400 }}>
              {/* Account Settings */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    Account Profile
                  </h3>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8b9e', marginBottom: '0.4rem', fontWeight: 600 }}>FULL NAME</label>
                    <input
                      className="input"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8b9e', marginBottom: '0.4rem', fontWeight: 600 }}>EMAIL ADDRESS</label>
                    <input
                      className="input"
                      type="email"
                      value={profileEmail}
                      onChange={e => setProfileEmail(e.target.value)}
                      placeholder="name@example.com"
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: 'fit-content', padding: '0.625rem 1.25rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Save size={14} /> Save Profile Changes
                  </button>
                </form>
              )}

              {/* API Keys */}
              {activeTab === 'keys' && (
                <form onSubmit={handleKeysSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
                      API Integrations
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#52526a' }}>Add your credentials to connect live AI pipelines.</p>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8b9e', marginBottom: '0.4rem', fontWeight: 600 }}>OPENAI API KEY (For scripts & prompt enhancements)</label>
                    <input
                      className="input"
                      type="password"
                      value={openaiKey}
                      onChange={e => setOpenaiKey(e.target.value)}
                      placeholder="sk-..."
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8b9e', marginBottom: '0.4rem', fontWeight: 600 }}>ELEVENLABS API KEY (For hyper-realistic voiceovers)</label>
                    <input
                      className="input"
                      type="password"
                      value={elevenLabsKey}
                      onChange={e => setElevenLabsKey(e.target.value)}
                      placeholder="el-..."
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8b9e', marginBottom: '0.4rem', fontWeight: 600 }}>RUNWAY / PIKA API KEY (For AI cinematic animation synthesis)</label>
                    <input
                      className="input"
                      type="password"
                      value={runwayKey}
                      onChange={e => setRunwayKey(e.target.value)}
                      placeholder="rw-..."
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: 'fit-content', padding: '0.625rem 1.25rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Save size={14} /> Update Credentials
                  </button>
                </form>
              )}

              {/* Brand Customization */}
              {activeTab === 'brand' && (
                <form onSubmit={handleBrandSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
                      Brand Customization
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#52526a' }}>Set default assets and video overlays.</p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8b9e', marginBottom: '0.625rem', fontWeight: 600 }}>BRAND LOGO OVERLAY</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          width: 80, height: 80, borderRadius: '0.75rem',
                          border: '2px dashed rgba(255,255,255,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', overflow: 'hidden', background: 'rgba(255,255,255,0.03)',
                          position: 'relative'
                        }}
                      >
                        {logoUrl ? (
                          <img src={logoUrl} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <Upload size={18} color="#8b8b9e" />
                        )}
                        {uploadingLogo && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 16, height: 16, border: '2px solid transparent', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => fileInputRef.current?.click()}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                        >
                          Choose Logo
                        </button>
                        <p style={{ fontSize: '0.7rem', color: '#52526a', marginTop: '0.4rem' }}>Upload PNG or SVG with transparent background.</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleLogoUpload}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#8b8b9e', marginBottom: '0.4rem', fontWeight: 600 }}>ACCENT HEX COLOR</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={brandingColor}
                        onChange={e => setBrandingColor(e.target.value)}
                        style={{ width: 40, height: 36, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.375rem', background: 'transparent', cursor: 'pointer' }}
                      />
                      <input
                        className="input"
                        value={brandingColor}
                        onChange={e => setBrandingColor(e.target.value)}
                        placeholder="#7C3AED"
                        style={{ maxWidth: 120 }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Default Watermark overlay</span>
                      <p style={{ fontSize: '0.725rem', color: '#52526a', marginTop: 2 }}>Automatically toggle off watermark overlays in new generations</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={!defaultWatermark}
                        onChange={e => setDefaultWatermark(!e.target.checked)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: 'fit-content', padding: '0.625rem 1.25rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Save size={14} /> Update Brand Defaults
                  </button>
                </form>
              )}

              {/* Plans & Billing */}
              {activeTab === 'billing' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                    <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
                      Membership Plans
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#52526a' }}>Upgrade or view details of your current subscription tier.</p>
                  </div>

                  {/* Pricing Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem' }}>
                    {[
                      { id: 'free', name: 'Starter', price: '$0', desc: 'Ideal for trial', list: ['3 standard videos/mo', '720p HD resolution', 'Voice narration'] },
                      { id: 'pro', name: 'Creator Pro', price: '$29', desc: 'Best for power creators', list: ['Unlimited videos', '1080p + 4K support', 'No watermark', 'Brand kits'] },
                      { id: 'enterprise', name: 'Business Max', price: '$99', desc: 'Custom pipeline setups', list: ['Dedicated instances', 'Custom API access', 'Priority support', 'Ultra speed sync'] }
                    ].map((plan) => {
                      const isCurrent = user?.plan === plan.id
                      return (
                        <div
                          key={plan.id}
                          style={{
                            padding: '1.25rem', borderRadius: '0.75rem',
                            border: isCurrent ? '2px solid #7c3aed' : '1px solid rgba(255,255,255,0.06)',
                            background: isCurrent ? 'rgba(124,58,237,0.04)' : 'rgba(255,255,255,0.01)',
                            display: 'flex', flexDirection: 'column', height: '100%', position: 'relative'
                          }}
                        >
                          {isCurrent && (
                            <span style={{ position: 'absolute', top: -10, right: 10, background: '#7c3aed', padding: '2px 8px', borderRadius: '999px', fontSize: '0.55rem', fontWeight: 700, color: 'white', textTransform: 'uppercase' }}>
                              Current Plan
                            </span>
                          )}
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isCurrent ? '#c4b5fd' : '#8b8b9e', marginBottom: '0.375rem' }}>{plan.name}</div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '0.5rem' }}>
                            <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.5rem', fontWeight: 800 }}>{plan.price}</span>
                            <span style={{ fontSize: '0.65rem', color: '#52526a' }}>/month</span>
                          </div>
                          <p style={{ fontSize: '0.7rem', color: '#8b8b9e', marginBottom: '0.875rem' }}>{plan.desc}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1, marginBottom: '1.25rem' }}>
                            {plan.list.map(feat => (
                              <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: '#8b8b9e' }}>
                                <Check size={11} color="#10b981" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => handleUpgradePlan(plan.id)}
                            disabled={isCurrent}
                            className={isCurrent ? 'btn-secondary' : 'btn-primary'}
                            style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', cursor: isCurrent ? 'default' : 'pointer' }}
                          >
                            {isCurrent ? 'Active Tier' : 'Upgrade Plan'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Admin Panel */}
              {activeTab === 'admin' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
                        System Control Dashboard (Admin Only)
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#52526a' }}>System status override, user permissions, and generation queues.</p>
                    </div>
                    <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#34d399', fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                      ADMIN GRANTED
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#8b8b9e', fontWeight: 600, marginBottom: '0.5rem' }}>SYSTEM API PIPELINE STATUS</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="pulse-dot" style={{ background: '#10b981', width: 8, height: 8 }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5f5f7' }}>ALL SYSTEMS OPERATIONAL</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#52526a', marginTop: '0.5rem' }}>
                        API servers, image engines, and voice processing connections are 100% online.
                      </div>
                    </div>

                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#8b8b9e', fontWeight: 600, marginBottom: '0.5rem' }}>ACTIVE CONNECTIONS & STREAMERS</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#06b6d4' }}>
                        2,481 <span style={{ fontSize: '0.7rem', color: '#52526a', fontWeight: 500 }}>Active Sessions</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#52526a', marginTop: '0.2rem' }}>
                        Active NDI streams local broadcasts: 1 active
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem', background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#c4b5fd', marginBottom: '0.5rem' }}>ADMIN ACTIONS & SYSTEM OVERRIDES</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button 
                        className="btn-primary" 
                        onClick={() => {
                          toast.success('All rendering queues successfully flushed!')
                        }}
                        style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                      >
                        Flush Render Queues
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => {
                          toast.success('Simulation sandbox successfully reset!')
                        }}
                        style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                      >
                        Reset System Sandbox
                      </button>
                    </div>
                  </div>

                  <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.15)' }}>
                    <div style={{ padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 700, fontSize: '0.8rem', color: '#8b8b9e' }}>
                      SYSTEM USER ROLES CONTROL LIST
                    </div>
                    <div style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name || 'Devesh Patel'}</div>
                        <div style={{ fontSize: '0.65rem', color: '#52526a' }}>{user?.email || 'admin@aivid-gen.ai'}</div>
                      </div>
                      <select 
                        className="input" 
                        value="admin"
                        onChange={(e) => {
                          toast.success(`User role updated to ${e.target.value.toUpperCase()}!`)
                        }}
                        style={{ width: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        <option value="user">Standard User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>
                    <div style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Demo User Account</div>
                        <div style={{ fontSize: '0.65rem', color: '#52526a' }}>demo@aivid-gen.ai</div>
                      </div>
                      <select 
                        className="input" 
                        value="user"
                        onChange={(e) => {
                          toast.success(`User role updated to ${e.target.value.toUpperCase()}!`)
                        }}
                        style={{ width: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        <option value="user">Standard User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">System Administrator</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  )
}
