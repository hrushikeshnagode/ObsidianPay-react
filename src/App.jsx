import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AuthPanel from './components/app/AuthPanel'
import DashboardPanel from './components/app/DashboardPanel'
import OnboardingFlow from './components/app/OnboardingFlow'
import { api } from './lib/api'

const TOKEN_KEY = 'ridgeflow_token'
const ONBOARDING_KEY = 'ridgeflow_onboarding_complete'

function WelcomeModal({ open, onStart }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#121417]/70 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg rounded-3xl border border-white/20 bg-white/[0.08] p-8 text-white shadow-2xl backdrop-blur-xl"
            initial={{ y: 20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#93C5FD]">RidgeFlow</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#F8FAFC]">Welcome to RidgeFlow</h1>
            <p className="mt-2 text-sm text-slate-200">
              Let&apos;s set up your roofing operations in under 3 minutes.
            </p>
            <button
              type="button"
              onClick={onStart}
              className="mt-6 inline-flex rounded-full bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(null)
  const [stage, setStage] = useState('auth')

  useEffect(() => {
    if (!token) {
      setUser(null)
      setStage('auth')
      return
    }

    api.me(token)
      .then((me) => {
        setUser(me)
        setStage('dashboard')
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
        setUser(null)
        setStage('auth')
      })
  }, [token])

  const handleAuthed = (authPayload, mode) => {
    localStorage.setItem(TOKEN_KEY, authPayload.token)
    setToken(authPayload.token)
    setUser({
      email: authPayload.email,
      role: authPayload.role,
      name: authPayload.name || '',
    })

    if (mode === 'register') {
      setStage('welcome')
      return
    }

    setStage('dashboard')
  }

  const handleOnboardingComplete = (profile) => {
    localStorage.setItem(ONBOARDING_KEY, '1')
    setUser((prev) => ({ ...prev, ...profile }))
    setStage('dashboard')
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setUser(null)
    setStage('auth')
  }

  return (
    <div className="min-h-screen bg-[#121417]">
      {stage === 'auth' ? <AuthPanel onAuthed={handleAuthed} /> : null}
      <WelcomeModal open={stage === 'welcome'} onStart={() => setStage('onboarding')} />
      {stage === 'onboarding' ? <OnboardingFlow onComplete={handleOnboardingComplete} /> : null}
      {stage === 'dashboard' && token ? <DashboardPanel token={token} user={user} onLogout={logout} /> : null}
    </div>
  )
}
