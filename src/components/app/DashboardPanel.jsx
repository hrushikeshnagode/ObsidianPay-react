import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../../lib/api'
import {
  AnimatedNumber, Card, StatusBadge, VoltTable, AnimatedBar,
  RevenueChart, ModuleWrap, PrimaryBtn, OutlineBtn, GreenBtn,
  stagger, fadeUp,
} from '../dashboard/CinematicUI'

/* ═══════ Constants ═══════ */
const moduleMeta = {
  overview: { title: 'Dashboard', subtitle: 'Live business pulse', icon: 'grid' },
  leads: { title: 'Leads', subtitle: 'Pipeline intake & qualification', icon: 'users' },
  estimates: { title: 'Estimates', subtitle: 'Pricing & approvals', icon: 'doc' },
  jobs: { title: 'Jobs', subtitle: 'Crew scheduling & execution', icon: 'wrench' },
  invoices: { title: 'Invoices', subtitle: 'Billing & payments', icon: 'receipt' },
  notifications: { title: 'Follow-ups', subtitle: 'Automations & reminders', icon: 'bell' },
  analytics: { title: 'Analytics', subtitle: 'Performance insights', icon: 'chart' },
  users: { title: 'Admin', subtitle: 'System & tenant controls', icon: 'gear' },
}
const adminModules = ['overview', 'leads', 'estimates', 'jobs', 'invoices', 'notifications', 'analytics', 'users']
const userModules = ['overview', 'leads', 'estimates', 'jobs', 'invoices']
const leadStages = ['NEW_LEAD', 'INSPECTION_SCHEDULED', 'ESTIMATE_SENT', 'PENDING_APPROVAL', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED']

const money = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(v || 0))
const shortDate = (v) => { if (!v) return '--'; const d = new Date(v); return Number.isNaN(d.getTime()) ? '--' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
const labelize = (v) => v ? String(v).toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '--'

const MATERIAL_CATALOG = [
  { id: 'arch_shingles', name: 'Architectural Shingles', pricePerSq: 160, laborPerSq: 180 },
  { id: '3tab_shingles', name: '3-Tab Shingles', pricePerSq: 120, laborPerSq: 160 },
  { id: 'metal_roofing', name: 'Metal Roofing', pricePerSq: 340, laborPerSq: 280 },
  { id: 'tile_roofing', name: 'Tile Roofing', pricePerSq: 450, laborPerSq: 350 },
  { id: 'flat_roofing', name: 'Flat TPO/PVC', pricePerSq: 220, laborPerSq: 220 },
]

const chartSamples = [
  { label: 'Mon', value: 2400 }, { label: 'Tue', value: 3890 }, { label: 'Wed', value: 3200 },
  { label: 'Thu', value: 5600 }, { label: 'Fri', value: 4800 }, { label: 'Sat', value: 7200 }, { label: 'Sun', value: 9800 },
]

/* ═══════ Icons ═══════ */
const I = {
  grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" /><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" /></svg>,
  doc: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8M10 9H8" /></svg>,
  wrench: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
  receipt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z" /><path d="M16 8H8M16 12H8M12 16H8" /></svg>,
  bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>,
  chart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>,
  gear: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M12 5v14M5 12h14" /></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-4 w-4"><path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-4 w-4"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  arrow: <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L12.586 12H5a1 1 0 110-2h7.586l-1.293-1.293A1 1 0 0112 7z" clipRule="evenodd" /></svg>,
}

/* ═══════ Component ═══════ */
export default function DashboardPanel({ token, user, onLogout }) {
  const isAdmin = user?.role === 'ADMIN'
  const modules = isAdmin ? adminModules : userModules
  const [activeModule, setActiveModule] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [leads, setLeads] = useState([])
  const [estimates, setEstimates] = useState([])
  const [jobs, setJobs] = useState([])
  const [invoices, setInvoices] = useState([])
  const [notifications, setNotifications] = useState([])
  const [summary, setSummary] = useState(null)
  const [estimators, setEstimators] = useState([])
  const [sources, setSources] = useState([])
  const [leadDraft, setLeadDraft] = useState({ clientName: '', phone: '', address: '', source: 'WEBSITE', jobType: 'Residential Roofing', notes: '' })
  const [estimateDraft, setEstimateDraft] = useState({
    leadId: '',
    roofAreaSq: 2300,
    materialType: MATERIAL_CATALOG[0].name,
    laborCostPerSq: MATERIAL_CATALOG[0].laborPerSq,
    materialCostPerSq: MATERIAL_CATALOG[0].pricePerSq,
    extraRepairs: 0
  })
  const [invoiceDraft, setInvoiceDraft] = useState({ jobId: '', amount: '', dueDate: '' })

  const leadCounts = useMemo(() => {
    const m = {}; leadStages.forEach(s => { m[s] = 0 }); leads.forEach(l => { const k = String(l.status || 'NEW_LEAD').toUpperCase(); m[k] = (m[k] || 0) + 1 }); return m
  }, [leads])

  const totals = useMemo(() => {
    const est = estimates.reduce((a, i) => a + Number(i.totalAmount || i.total || 0), 0)
    const inv = invoices.reduce((a, i) => a + Number(i.totalAmount || i.amount || 0), 0)
    const paid = invoices.filter(i => String(i.status || '').toUpperCase() === 'PAID').reduce((a, i) => a + Number(i.totalAmount || i.amount || 0), 0)
    return { leads: leads.length, estimates: estimates.length, jobs: jobs.length, invoices: invoices.length, estimateValue: est, invoiceValue: inv, collected: paid }
  }, [leads, estimates, jobs, invoices])

  const refreshAll = async () => {
    setError(''); setLoading(true)
    try {
      const c = await Promise.all([api.listLeads(token), api.listEstimates(token), api.listJobs(token), api.listInvoices(token)])
      setLeads(Array.isArray(c[0]) ? c[0] : []); setEstimates(Array.isArray(c[1]) ? c[1] : []); setJobs(Array.isArray(c[2]) ? c[2] : []); setInvoices(Array.isArray(c[3]) ? c[3] : [])
      if (isAdmin) {
        const a = await Promise.allSettled([api.listNotifications(token), api.getAnalyticsSummary(token), api.getEstimatorPerformance(token), api.getLeadSourcePerformance(token)])
        setNotifications(a[0].status === 'fulfilled' && Array.isArray(a[0].value) ? a[0].value : [])
        setSummary(a[1].status === 'fulfilled' ? a[1].value : null)
        setEstimators(a[2].status === 'fulfilled' && Array.isArray(a[2].value) ? a[2].value : [])
        setSources(a[3].status === 'fulfilled' && Array.isArray(a[3].value) ? a[3].value : [])
      } else { setNotifications([]); setSummary(null); setEstimators([]); setSources([]) }
    } catch (err) { setError(err.message || 'Unable to load data') } finally { setLoading(false) }
  }
  useEffect(() => { refreshAll() }, [token, isAdmin])

  const run = async (work) => { setBusy(true); setError(''); try { await work(); await refreshAll() } catch (e) { setError(e.message || 'Action failed') } finally { setBusy(false) } }
  const createLead = () => run(async () => { await api.createLead(token, leadDraft); setLeadDraft({ clientName: '', phone: '', address: '', source: 'WEBSITE', jobType: 'Residential Roofing', notes: '' }) })
  const createEstimate = () => run(async () => {
    const lead = leads.find(l => String(l.id) === String(estimateDraft.leadId))
    await api.createEstimate(token, {
      leadId: Number(estimateDraft.leadId),
      clientName: lead?.clientName || lead?.name || 'Unknown Client',
      roofSizeSq: Number(estimateDraft.roofAreaSq || 0),
      materialType: estimateDraft.materialType,
      laborCostPerSq: Number(estimateDraft.laborCostPerSq || 0),
      materialCostPerSq: Number(estimateDraft.materialCostPerSq || 0),
      extraRepairs: Number(estimateDraft.extraRepairs || 0)
    });
    setEstimateDraft(p => ({ ...p, leadId: '' }))
  })
  const createInvoice = () => run(async () => { await api.createInvoice(token, { jobId: invoiceDraft.jobId, amount: Number(invoiceDraft.amount || 0), dueDate: invoiceDraft.dueDate || null }); setInvoiceDraft({ jobId: '', amount: '', dueDate: '' }) })
  const approveEstimate = (e) => run(async () => { await api.updateEstimateStatus(token, e.id, 'APPROVED'); await api.createJob(token, { estimateId: e.id, leadId: e.leadId, status: 'SCHEDULED' }) })
  const markPaid = (inv) => run(async () => { const t = Number(inv.totalAmount || inv.amount || 0); await api.recordInvoicePayment(token, inv.id, t); await api.updateInvoiceStatus(token, inv.id, 'PAID') })
  const triggerFollowUp = () => run(async () => { await api.triggerPendingEstimateFollowUp(token, { channel: 'EMAIL' }) })

  const pipelinePercents = useMemo(() => {
    const t = leads.length || 1
    return [
      { label: 'New Leads', pct: Math.round((leadCounts.NEW_LEAD / t) * 100), color: '#3b82f6' },
      { label: 'Inspection', pct: Math.round((leadCounts.INSPECTION_SCHEDULED / t) * 100), color: '#8b5cf6' },
      { label: 'Estimate Sent', pct: Math.round((leadCounts.ESTIMATE_SENT / t) * 100), color: '#f59e0b' },
      { label: 'Approved', pct: Math.round((leadCounts.APPROVED / t) * 100), color: '#05a677' },
      { label: 'Completed', pct: Math.round((leadCounts.COMPLETED / t) * 100), color: '#06b6d4' },
    ]
  }, [leadCounts, leads.length])

  /* ═══════ Module Renderers ═══════ */
  const renderOverview = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}><PrimaryBtn onClick={() => setActiveModule('leads')}>{I.plus} New Lead</PrimaryBtn></motion.div>

      {/* Revenue Chart */}
      <motion.div variants={fadeUp}>
        <Card hover={false} className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Sales Value</h3>
              <p className="text-[28px] font-bold text-slate-800 tracking-tight">{money(totals.collected || 10567)}</p>
              <p className="text-[13px] text-slate-500 mt-1">Yesterday <span className="font-semibold text-emerald-500 ml-1">↑ 10.57%</span></p>
            </div>
            <div className="flex rounded-md text-[13px] font-medium overflow-hidden">
              <button className="px-3 py-1.5 bg-gray-100 text-gray-700 font-semibold rounded-md">Month</button>
              <button className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition ml-1">Week</button>
            </div>
          </div>
          <div className="mt-6">
            <RevenueChart data={chartSamples} />
          </div>
        </Card>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Active Leads', val: totals.leads, icon: I.users, bg: 'bg-orange-100 text-orange-600', chg: '+12%' },
          { label: 'Estimate Value', val: money(totals.estimateValue), icon: I.doc, bg: 'bg-blue-100 text-blue-600', chg: '+8.5%' },
          { label: 'Active Jobs', val: totals.jobs, icon: I.wrench, bg: 'bg-emerald-100 text-emerald-600', chg: '+5%' },
          { label: 'Collected', val: money(totals.collected), icon: I.receipt, bg: 'bg-violet-100 text-violet-600', chg: totals.invoiceValue > 0 ? `${Math.round((totals.collected / totals.invoiceValue) * 100)}%` : '0%' },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp}>
            <Card hover={false} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>{s.icon}</div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-slate-500 mb-0.5">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-800 tracking-tight">{typeof s.val === 'number' ? <AnimatedNumber value={s.val} /> : s.val}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pipeline + Recent */}
      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div variants={fadeUp}>
          <Card hover={false} className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-slate-800">Pipeline Progress</h3>
              <OutlineBtn onClick={() => setActiveModule('leads')}>See all</OutlineBtn>
            </div>
            <div className="space-y-4">
              {pipelinePercents.map((p, i) => <AnimatedBar key={p.label} label={p.label} percent={p.pct} color={p.color} delay={i * 0.1} />)}
            </div>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <VoltTable columns={['Client', 'Source', 'Status', 'Date']}
            rows={leads.slice(0, 5).map(l => [
              <span key={l.id} className="font-medium text-slate-800">{l.clientName || l.name || 'Unknown'}</span>,
              <span key={`${l.id}-s`} className="text-slate-500">{labelize(l.source)}</span>,
              <StatusBadge key={`${l.id}-st`} status={l.status || 'NEW_LEAD'} />,
              <span key={`${l.id}-d`} className="text-slate-400">{shortDate(l.createdAt)}</span>,
            ])} emptyText="No leads yet" />
        </motion.div>
      </div>
    </motion.div>
  )

  const renderLeads = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <Card hover={false} className="p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Create Lead</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="volt-input" placeholder="Client Name" value={leadDraft.clientName || ''} onChange={e => setLeadDraft(p => ({ ...p, clientName: e.target.value }))} />
            <input className="volt-input" placeholder="Phone" value={leadDraft.phone} onChange={e => setLeadDraft(p => ({ ...p, phone: e.target.value }))} />
            <input className="volt-input" placeholder="Address" value={leadDraft.address} onChange={e => setLeadDraft(p => ({ ...p, address: e.target.value }))} />
            <select className="volt-input" value={leadDraft.source} onChange={e => setLeadDraft(p => ({ ...p, source: e.target.value }))}>
              <option value="WEBSITE">Website</option><option value="GOOGLE_ADS">Google Ads</option><option value="FACEBOOK">Facebook</option><option value="REFERRAL">Referral</option><option value="PHONE">Phone</option>
            </select>
            <input className="volt-input md:col-span-2" placeholder="Job type" value={leadDraft.jobType} onChange={e => setLeadDraft(p => ({ ...p, jobType: e.target.value }))} />
            <textarea className="volt-input md:col-span-2" rows={3} placeholder="Notes" value={leadDraft.notes} onChange={e => setLeadDraft(p => ({ ...p, notes: e.target.value }))} />
          </div>
          <div className="mt-4"><PrimaryBtn onClick={createLead} disabled={busy || !leadDraft.clientName || !leadDraft.phone}>{busy ? 'Saving…' : 'Add Lead'}</PrimaryBtn></div>
        </Card>
      </motion.div>
      <motion.div variants={fadeUp}>
        <VoltTable columns={['Client', 'Source', 'Status', 'Created']}
          rows={leads.slice(0, 15).map(l => [
            <span key={l.id} className="font-medium text-slate-800">{l.clientName || l.name || 'Unknown'}</span>,
            <span key={`${l.id}-s`} className="text-slate-500">{labelize(l.source)}</span>,
            <StatusBadge key={`${l.id}-st`} status={l.status || 'NEW_LEAD'} />,
            <span key={`${l.id}-d`} className="text-slate-400">{shortDate(l.createdAt)}</span>,
          ])} emptyText="No leads yet" />
      </motion.div>
    </motion.div>
  )

  const renderEstimates = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <Card hover={false} className="p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Create Estimate</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <select className="volt-input" value={estimateDraft.leadId} onChange={e => setEstimateDraft(p => ({ ...p, leadId: e.target.value }))}>
              <option value="">Select lead</option>{leads.map(l => <option key={l.id} value={l.id}>{l.clientName || l.name || l.id}</option>)}
            </select>
            <input className="volt-input" type="number" placeholder="Roof area sq" value={estimateDraft.roofAreaSq} onChange={e => setEstimateDraft(p => ({ ...p, roofAreaSq: e.target.value }))} />

            <select className="volt-input" value={estimateDraft.materialType} onChange={e => {
              const m = MATERIAL_CATALOG.find(x => x.name === e.target.value);
              setEstimateDraft(p => ({ ...p, materialType: e.target.value, materialCostPerSq: m?.pricePerSq || 0, laborCostPerSq: m?.laborPerSq || 0 }));
            }}>
              {MATERIAL_CATALOG.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input className="volt-input pl-6" type="number" placeholder="Material/sq" value={estimateDraft.materialCostPerSq} onChange={e => setEstimateDraft(p => ({ ...p, materialCostPerSq: e.target.value }))} />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input className="volt-input pl-6" type="number" placeholder="Labor/sq" value={estimateDraft.laborCostPerSq} onChange={e => setEstimateDraft(p => ({ ...p, laborCostPerSq: e.target.value }))} />
              </div>
            </div>

            <input className="volt-input md:col-span-2" type="number" placeholder="Extra repairs (optional)" value={estimateDraft.extraRepairs || ''} onChange={e => setEstimateDraft(p => ({ ...p, extraRepairs: e.target.value }))} />
          </div>
          <div className="mt-4"><PrimaryBtn onClick={createEstimate} disabled={busy || !estimateDraft.leadId}>{busy ? 'Saving…' : 'Create Estimate'}</PrimaryBtn></div>
        </Card>
      </motion.div>
      <motion.div variants={fadeUp}>
        <Card hover={false} className="p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Estimate Queue</h3>
          <div className="space-y-2">
            {estimates.slice(0, 15).map((est, idx) => (
              <motion.div key={est.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 transition-colors hover:bg-gray-100">
                <div><p className="text-sm font-semibold text-slate-800">{est.estimateNumber || est.id}</p><p className="text-xs text-slate-500">{money(est.totalAmount || est.total || 0)}</p></div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={est.status || 'DRAFT'} />
                  <OutlineBtn onClick={() => run(() => api.updateEstimateStatus(token, est.id, 'SENT'))}>Send</OutlineBtn>
                  <GreenBtn onClick={() => approveEstimate(est)}>Approve + Job</GreenBtn>
                </div>
              </motion.div>
            ))}
            {estimates.length === 0 && <p className="py-4 text-sm text-slate-400">No estimates yet</p>}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderJobs = () => (
    <motion.div variants={stagger} initial="hidden" animate="show">
      <motion.div variants={fadeUp}>
        <Card hover={false} className="p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Execution Board</h3>
          <div className="space-y-2">
            {jobs.slice(0, 15).map((job, idx) => (
              <motion.div key={job.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 transition-colors hover:bg-gray-100">
                <div><p className="text-sm font-semibold text-slate-800">{job.jobNumber || job.id}</p><p className="text-xs text-slate-500">Scheduled: {shortDate(job.scheduledDate)}</p></div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={job.status || 'SCHEDULED'} />
                  <OutlineBtn onClick={() => run(() => api.updateJobStatus(token, job.id, { status: 'IN_PROGRESS' }))}>Start</OutlineBtn>
                  <GreenBtn onClick={() => run(() => api.updateJobStatus(token, job.id, { status: 'COMPLETED' }))}>Complete</GreenBtn>
                </div>
              </motion.div>
            ))}
            {jobs.length === 0 && <p className="py-4 text-sm text-slate-400">No jobs yet</p>}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )

  const renderInvoices = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <Card hover={false} className="p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">Create Invoice</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <select className="volt-input" value={invoiceDraft.jobId} onChange={e => setInvoiceDraft(p => ({ ...p, jobId: e.target.value }))}>
              <option value="">Select job</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.jobNumber || j.id}</option>)}
            </select>
            <input className="volt-input" type="number" placeholder="Amount" value={invoiceDraft.amount} onChange={e => setInvoiceDraft(p => ({ ...p, amount: e.target.value }))} />
            <input className="volt-input" type="date" value={invoiceDraft.dueDate} onChange={e => setInvoiceDraft(p => ({ ...p, dueDate: e.target.value }))} />
          </div>
          <div className="mt-4"><PrimaryBtn onClick={createInvoice} disabled={busy || !invoiceDraft.jobId || !invoiceDraft.amount}>{busy ? 'Saving…' : 'Create Invoice'}</PrimaryBtn></div>
        </Card>
      </motion.div>
      <motion.div variants={fadeUp}>
        <VoltTable columns={['Invoice', 'Amount', 'Status', 'Action']}
          rows={invoices.slice(0, 15).map(inv => [
            <span key={inv.id} className="font-medium text-slate-800">{inv.invoiceNumber || inv.id}</span>,
            <span key={`${inv.id}-a`} className="text-slate-600">{money(inv.totalAmount || inv.amount || 0)}</span>,
            <StatusBadge key={`${inv.id}-s`} status={inv.status || 'PENDING'} />,
            <GreenBtn key={`${inv.id}-b`} onClick={() => markPaid(inv)}>Mark Paid</GreenBtn>,
          ])} emptyText="No invoices yet" />
      </motion.div>
    </motion.div>
  )

  const renderNotifications = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <Card hover={false} className="p-6">
          <h3 className="text-base font-semibold text-slate-800">Follow-up Engine</h3>
          <p className="mt-2 text-sm text-slate-500">Trigger reminders for pending estimates.</p>
          <div className="mt-4"><PrimaryBtn onClick={triggerFollowUp}>Trigger 3-Day Follow-up</PrimaryBtn></div>
        </Card>
      </motion.div>
      <motion.div variants={fadeUp}>
        <VoltTable columns={['Type', 'Channel', 'Status', 'Created']}
          rows={notifications.slice(0, 15).map(n => [
            <span key={`${n.id}-t`} className="text-slate-600">{labelize(n.type)}</span>,
            <span key={`${n.id}-c`} className="text-slate-500">{labelize(n.channel)}</span>,
            <StatusBadge key={n.id} status={n.status || 'PENDING'} />,
            <span key={`${n.id}-d`} className="text-slate-400">{shortDate(n.createdAt)}</span>,
          ])} emptyText="No notifications yet" />
      </motion.div>
    </motion.div>
  )

  const renderAnalytics = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Monthly Revenue', val: money(summary?.monthlyRevenue || totals.collected), bg: 'bg-emerald-100 text-emerald-600', icon: I.chart },
          { label: 'Close Rate', val: `${summary?.closeRatePercent ?? 0}%`, bg: 'bg-blue-100 text-blue-600', icon: I.doc },
          { label: 'Avg Job Value', val: money(summary?.avgJobValue || 0), bg: 'bg-violet-100 text-violet-600', icon: I.wrench },
          { label: 'Pending Est.', val: summary?.pendingEstimateCount ?? 0, bg: 'bg-amber-100 text-amber-600', icon: I.bell },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp}>
            <Card className="p-5"><div className="flex items-center gap-4"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${s.bg}`}>{s.icon}</div><div><p className="text-sm text-slate-500">{s.label}</p><p className="text-2xl font-bold text-slate-800">{s.val}</p></div></div></Card>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <motion.div variants={fadeUp}>
          <VoltTable columns={['Estimator', 'Sent', 'Approved', 'Close %']}
            rows={estimators.slice(0, 10).map(r => [<span key={r.name} className="font-medium text-slate-800">{r.name || r.estimator || '--'}</span>, r.sentCount ?? 0, r.approvedCount ?? 0, <span key={`${r.name}-p`} className="font-semibold text-blue-600">{r.closeRatePercent ?? 0}%</span>])}
            emptyText="No estimator metrics" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <VoltTable columns={['Lead Source', 'Leads', 'Won', 'Win %']}
            rows={sources.slice(0, 10).map(r => [<span key={r.source} className="font-medium text-slate-800">{labelize(r.source)}</span>, r.leadCount ?? 0, r.wonCount ?? 0, <span key={`${r.source}-p`} className="font-semibold text-emerald-600">{r.winRatePercent ?? 0}%</span>])}
            emptyText="No lead source metrics" />
        </motion.div>
      </div>
    </motion.div>
  )

  const activeTitle = moduleMeta[activeModule]?.title || 'Dashboard'
  const activeSubtitle = moduleMeta[activeModule]?.subtitle || ''
  const moduleContent = () => {
    if (activeModule === 'overview') return renderOverview()
    if (activeModule === 'leads') return renderLeads()
    if (activeModule === 'estimates') return renderEstimates()
    if (activeModule === 'jobs') return renderJobs()
    if (activeModule === 'invoices') return renderInvoices()
    if (activeModule === 'notifications' && isAdmin) return renderNotifications()
    if (activeModule === 'analytics' && isAdmin) return renderAnalytics()
    if (activeModule === 'users' && isAdmin) return <Card hover={false} className="p-8 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">{I.gear}</div><h3 className="text-lg font-semibold text-slate-800">Admin Controls</h3><p className="mt-2 text-sm text-slate-500">System configuration and user management coming soon.</p></Card>
    return null
  }

  /* ═══════ Layout ═══════ */
  return (
    <div className="flex min-h-screen bg-[#f5f8fb] bg-cover bg-center bg-no-repeat bg-fixed relative" style={{ backgroundImage: "url('/bg-main.png')" }}>
      {/* ── Sidebar ── */}
      <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden xl:flex xl:w-[260px] xl:flex-col xl:fixed xl:inset-y-0 text-white shadow-xl z-30 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/bg-sidebar.png')" }}>
        {/* Light overlay for sidebar readability */}
        <div className="absolute inset-0 bg-white/85 backdrop-blur-[3px] border-r border-gray-200"></div>

        <div className="flex flex-col h-full p-4 relative z-10">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 mb-6 mt-2">
            <div className="flex items-center justify-center text-gray-800">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            </div>
            <div><p className="text-[1.05rem] font-bold text-gray-900 tracking-wide">RidgeFlow</p></div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {modules.map((key, i) => {
              const active = activeModule === key
              return (
                <motion.button key={key} type="button" onClick={() => setActiveModule(key)}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
                  className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-all duration-200 ${active ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'}`}>
                  {active && <motion.div layoutId="nav-bg" className="absolute inset-0 rounded-md bg-white/60 shadow-sm" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span className={`relative z-10 ${active ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>{I[moduleMeta[key].icon]}</span>
                  <span className="relative z-10 text-[0.875rem]">{moduleMeta[key].title}</span>
                </motion.button>
              )
            })}
          </nav>

          {/* Bottom */}
          <div className="space-y-1 mt-4 pt-4 border-t border-gray-200/50">
            <button type="button" onClick={refreshAll} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[0.85rem] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"><span className="text-gray-500">{I.refresh}</span><span>Refresh</span></button>
            <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[0.85rem] font-medium text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition"><span className="text-rose-500">{I.logout}</span><span>Logout</span></button>
          </div>

        </div>
      </motion.aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col xl:pl-[260px] bg-transparent">
        {/* Top bar */}
        <motion.header initial={{ y: -60 }} animate={{ y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}
          className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200/60 bg-white/80 backdrop-blur-md px-6 py-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{I.search}</span>
            <input placeholder="Search..." className="rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 w-56 transition" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-600 transition">{I.bell}
              {notifications.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{notifications.length}</span>}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{(user?.name || 'U')[0].toUpperCase()}</div>
              <div className="hidden sm:block"><p className="text-sm font-semibold text-slate-700">{user?.name || 'User'}</p><p className="text-[10px] text-slate-400">{isAdmin ? 'Admin' : 'Team Member'}</p></div>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-transparent">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <h1 className="text-xl font-bold text-slate-800">{activeTitle}</h1>
            <p className="text-[13px] text-slate-500 mt-1">{activeSubtitle}</p>
          </motion.div>
          {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</motion.div>}
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-32 rounded-xl bg-white border border-slate-100 animate-pulse" />)}</div>
          ) : (
            <AnimatePresence mode="wait"><ModuleWrap moduleKey={activeModule}>{moduleContent()}</ModuleWrap></AnimatePresence>
          )}
        </main>
      </div>
    </div>
  )
}
