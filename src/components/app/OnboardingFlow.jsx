import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RiveBadge } from '../ui'

const services = [
  'Residential roofing',
  'Commercial roofing',
  'Storm damage repair',
  'Roof inspection',
  'Gutter installation',
]

const leadSources = ['Google Ads', 'Facebook', 'Referral', 'Door knocking', 'Insurance']
const roles = ['Admin', 'Estimator', 'Crew']

const defaultForm = {
  companyName: '',
  logoName: '',
  phone: '',
  address: '',
  timezone: 'America/New_York',
  services: ['Residential roofing'],
  laborCostPerSq: 50,
  materialMarkupPct: 18,
  minimumJobPrice: 750,
  taxRate: 8.25,
  team: [{ name: '', role: 'Admin' }],
  leadSources: ['Referral'],
}

function ProgressDots({ step, total }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, idx) => (
        <span
          key={idx}
          className={`h-2.5 rounded-full transition-all ${idx <= step ? 'w-7 bg-[#2563EB]' : 'w-2.5 bg-slate-300'}`}
        />
      ))}
    </div>
  )
}

function StepTitle({ tag, title, subtitle }) {
  return (
    <header>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">{tag}</p>
      <h2 className="mt-2 text-3xl font-semibold text-[#121417]">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
    </header>
  )
}

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const totalSteps = 5
  const canGoBack = step > 0 && !submitted

  const stepBody = useMemo(() => {
    if (step === 0) {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            placeholder="Company name"
            value={form.companyName}
            onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
            className="ridge-input md:col-span-2"
          />
          <label className="ridge-input flex items-center justify-between gap-3 text-sm text-slate-700">
            <span>{form.logoName || 'Upload company logo'}</span>
            <input
              type="file"
              accept="image/*"
              className="w-[170px] text-xs"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setForm((p) => ({ ...p, logoName: file ? file.name : '' }))
              }}
            />
          </label>
          <input
            required
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            className="ridge-input"
          />
          <input
            required
            placeholder="Timezone"
            value={form.timezone}
            onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))}
            className="ridge-input"
          />
          <input
            required
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            className="ridge-input md:col-span-2"
          />
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          {services.map((service) => {
            const active = form.services.includes(service)
            return (
              <button
                key={service}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    services: active
                      ? prev.services.filter((s) => s !== service)
                      : [...prev.services, service],
                  }))
                }
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${active ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]' : 'border-slate-200 bg-white hover:border-[#93C5FD]'}`}
              >
                {service}
              </button>
            )
          })}
        </div>
      )
    }

    if (step === 2) {
      return (
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-slate-700">
            Average labor cost per sq
            <input
              type="number"
              min="0"
              value={form.laborCostPerSq}
              onChange={(e) => setForm((p) => ({ ...p, laborCostPerSq: Number(e.target.value) }))}
              className="ridge-input"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Default material markup %
            <input
              type="number"
              min="0"
              value={form.materialMarkupPct}
              onChange={(e) => setForm((p) => ({ ...p, materialMarkupPct: Number(e.target.value) }))}
              className="ridge-input"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Minimum job price
            <input
              type="number"
              min="0"
              value={form.minimumJobPrice}
              onChange={(e) => setForm((p) => ({ ...p, minimumJobPrice: Number(e.target.value) }))}
              className="ridge-input"
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Tax rate
            <input
              type="number"
              min="0"
              value={form.taxRate}
              onChange={(e) => setForm((p) => ({ ...p, taxRate: Number(e.target.value) }))}
              className="ridge-input"
            />
          </label>
        </div>
      )
    }

    if (step === 3) {
      return (
        <div className="grid gap-3">
          {form.team.map((member, idx) => (
            <div key={idx} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_170px_auto]">
              <input
                placeholder="Team member name"
                value={member.name}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    team: p.team.map((m, i) => (i === idx ? { ...m, name: e.target.value } : m)),
                  }))
                }
                className="ridge-input"
              />
              <select
                value={member.role}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    team: p.team.map((m, i) => (i === idx ? { ...m, role: e.target.value } : m)),
                  }))
                }
                className="ridge-input"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={form.team.length === 1}
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    team: p.team.filter((_, i) => i !== idx),
                  }))
                }
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:opacity-40"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, team: [...p.team, { name: '', role: 'Crew' }] }))}
            className="w-fit rounded-full border border-[#2563EB]/35 px-4 py-2 text-sm font-medium text-[#2563EB]"
          >
            Add team member
          </button>
        </div>
      )
    }

    return (
      <div className="grid gap-3 md:grid-cols-2">
        {leadSources.map((source) => {
          const active = form.leadSources.includes(source)
          return (
            <button
              key={source}
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  leadSources: active
                    ? prev.leadSources.filter((s) => s !== source)
                    : [...prev.leadSources, source],
                }))
              }
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${active ? 'border-[#14B8A6] bg-[#ECFEFF] text-[#0F766E]' : 'border-slate-200 bg-white hover:border-[#5EEAD4]'}`}
            >
              {source}
            </button>
          )
        })}
      </div>
    )
  }, [form, step])

  const submitStep = (e) => {
    e.preventDefault()
    if (step < totalSteps - 1) {
      setStep((s) => s + 1)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl"
        >
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
            <RiveBadge
              src="/rive/onboarding-success.riv"
              className="mb-5 h-16 w-16 rounded-full bg-[#DBEAFE]"
              fallback="✓"
              fallbackClassName="mb-5 h-16 w-16 rounded-full bg-[#DBEAFE] text-3xl text-[#2563EB]"
            />
          </motion.div>
          <h2 className="text-4xl font-semibold text-[#121417]">Your Roofing Operations Are Ready.</h2>
          <p className="mt-3 text-sm text-slate-600">You can edit settings anytime.</p>
          <button
            type="button"
            onClick={() => onComplete(form)}
            className="mt-7 rounded-full bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  const titles = [
    {
      tag: 'Step 1',
      title: 'Company Setup',
      subtitle: 'Tell RidgeFlow about your business profile and contact details.',
    },
    {
      tag: 'Step 2',
      title: 'Services Offered',
      subtitle: 'Pick your service mix so AI estimating can be tuned to your jobs.',
    },
    {
      tag: 'Step 3',
      title: 'Pricing Defaults',
      subtitle: 'Set baseline pricing values for estimates and profitability guidance.',
    },
    {
      tag: 'Step 4',
      title: 'Team Setup',
      subtitle: 'Add your estimators and crew so scheduling starts with structure.',
    },
    {
      tag: 'Step 5',
      title: 'Lead Sources',
      subtitle: 'Track where your leads come from to power source-level analytics.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-10 md:px-8">
      <form onSubmit={submitStep} className="mx-auto w-full max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ProgressDots step={step} total={totalSteps} />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {step + 1} / {totalSteps}
          </span>
        </div>

        <div className="mt-6">
          <StepTitle {...titles[step]} />
          <div className="mt-6">{stepBody}</div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => canGoBack && setStep((s) => s - 1)}
            disabled={!canGoBack}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          <button type="submit" className="rounded-full bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1D4ED8]">
            {step === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}
