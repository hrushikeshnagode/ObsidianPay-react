import { useState } from 'react'
import { api } from '../../lib/api'
import { RiveBadge } from '../ui'

const emptyRegister = { name: '', companyName: '', email: '', password: '' }
const emptyLogin = { email: '', password: '' }

export default function AuthPanel({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [login, setLogin] = useState(emptyLogin)
  const [register, setRegister] = useState(emptyRegister)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result =
        mode === 'login'
          ? await api.login(login)
          : await api.register(register)
      onAuthed(result, mode)
      setLogin(emptyLogin)
      setRegister(emptyRegister)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#121417] text-[#F8FAFC]">
      <div className="absolute inset-0 ridge-login-bg" />
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#2563EB]/25 blur-3xl" />
      <div className="absolute right-10 top-24 h-56 w-56 rounded-full bg-[#14B8A6]/20 blur-3xl" />
      <div className="absolute inset-y-0 left-0 w-[64%] bg-gradient-to-r from-[#0B1220]/88 via-[#0B1220]/62 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#121417]/42 via-[#121417]/26 to-[#121417]/44" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="inline-flex items-center gap-3">
          <RiveBadge
            src="/rive/logo-loop.riv"
            className="h-9 w-9 rounded-xl bg-[#2563EB]/25"
            fallback="RF"
            fallbackClassName="h-9 w-9 rounded-xl bg-[#2563EB]/25 text-sm font-bold text-[#BFDBFE]"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200/80">RidgeFlow</p>
            <p className="text-sm text-slate-100">Roofing Operations Platform</p>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center px-6 pb-10 md:px-10">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BFDBFE]">AI Operations Platform For Roofers</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-[#F8FAFC] md:text-5xl">
              Close More Roofing Jobs Automatically.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-200 md:text-base">
              AI-powered estimating, scheduling, and job management built exclusively for roofing companies.
            </p>
            <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
              <div className="ridge-auth-chip">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-300">Pipeline</p>
                <p className="mt-1 text-sm text-white">Lead to invoice</p>
              </div>
              <div className="ridge-auth-chip">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-300">AI Estimating</p>
                <p className="mt-1 text-sm text-white">Faster quote flow</p>
              </div>
              <div className="ridge-auth-chip">
                <p className="text-[11px] uppercase tracking-[0.14em] text-slate-300">Automation</p>
                <p className="mt-1 text-sm text-white">Follow-ups + alerts</p>
              </div>
            </div>
          </section>

          <div className="w-full max-w-md justify-self-end rounded-3xl border border-white/20 bg-[#0B1220]/55 p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="mt-1 text-sm text-slate-200">Sign in to continue or create a new company account.</p>

            <div className="relative mt-5 grid grid-cols-2 rounded-full border border-white/15 bg-white/[0.04] p-1">
              <span
                className={`pointer-events-none absolute bottom-1 top-1 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-b from-[#3B82F6] to-[#2563EB] shadow-[0_6px_18px_rgba(37,99,235,0.45)] transition-transform duration-300 ${mode === 'login' ? 'translate-x-0' : 'translate-x-full'}`}
              />
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`relative z-10 rounded-full px-3 py-2 text-sm transition ${mode === 'login' ? 'text-white' : 'text-slate-200 hover:bg-white/10'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`relative z-10 rounded-full px-3 py-2 text-sm transition ${mode === 'register' ? 'text-white' : 'text-slate-200 hover:bg-white/10'}`}
              >
                Register
              </button>
            </div>

            <form onSubmit={submit} className="mt-4 grid gap-3">
              {mode === 'register' ? (
                <>
                  <input
                    required
                    placeholder="Full name"
                    value={register.name}
                    onChange={(e) => setRegister((p) => ({ ...p, name: e.target.value }))}
                    className="ridge-auth-input"
                  />
                  <input
                    required
                    placeholder="Company name"
                    value={register.companyName}
                    onChange={(e) => setRegister((p) => ({ ...p, companyName: e.target.value }))}
                    className="ridge-auth-input"
                  />
                </>
              ) : null}
              <input
                required
                type="email"
                placeholder="Work email"
                value={mode === 'login' ? login.email : register.email}
                onChange={(e) =>
                  mode === 'login'
                    ? setLogin((p) => ({ ...p, email: e.target.value }))
                    : setRegister((p) => ({ ...p, email: e.target.value }))
                }
                className="ridge-auth-input"
              />
              <input
                required
                type="password"
                placeholder="Password"
                value={mode === 'login' ? login.password : register.password}
                onChange={(e) =>
                  mode === 'login'
                    ? setLogin((p) => ({ ...p, password: e.target.value }))
                    : setRegister((p) => ({ ...p, password: e.target.value }))
                }
                className="ridge-auth-input"
              />

              {error ? <p className="text-sm text-rose-300">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:from-[#60A5FA] hover:to-[#2563EB] hover:shadow-[0_8px_20px_rgba(37,99,235,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/45 border-t-white" /> : null}
                {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
