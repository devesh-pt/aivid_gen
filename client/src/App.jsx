import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import CreateVideo from './pages/CreateVideo'
import Editor from './pages/Editor'
import Templates from './pages/Templates'
import SettingsPage from './pages/Settings'
import AuthPage from './pages/AuthPage'
import { useAuthStore } from './store/authStore'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen">
      <div className="animated-bg" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateVideo />} />
        <Route path="/editor/:videoId" element={<Editor />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
