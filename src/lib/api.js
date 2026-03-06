const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'
const AUTH_API_BASE = API_BASE || import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:8081'
const LEAD_API_BASE = API_BASE || import.meta.env.VITE_LEAD_API_BASE_URL || 'http://localhost:8082'
const ESTIMATE_API_BASE = API_BASE || import.meta.env.VITE_ESTIMATE_API_BASE_URL || 'http://localhost:8083'
const JOB_API_BASE = API_BASE || import.meta.env.VITE_JOB_API_BASE_URL || 'http://localhost:8084'
const INVOICE_API_BASE = API_BASE || import.meta.env.VITE_INVOICE_API_BASE_URL || 'http://localhost:8085'
const NOTIFICATION_API_BASE = API_BASE || import.meta.env.VITE_NOTIFICATION_API_BASE_URL || 'http://localhost:8086'
const ANALYTICS_API_BASE = API_BASE || import.meta.env.VITE_ANALYTICS_API_BASE_URL || 'http://localhost:8087'

function buildUrl(baseUrl, path) {
  if (!baseUrl) return path
  if (baseUrl.endsWith('/api') && path.startsWith('/api/')) {
    return `${baseUrl}${path.slice(4)}`
  }
  return `${baseUrl}${path}`
}

async function request(baseUrl, path, { method = 'GET', token, body, raw = false } = {}) {
  const headers = {}
  if (!raw) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(buildUrl(baseUrl, path), {
    method,
    headers,
    body: body ? (raw ? body : JSON.stringify(body)) : undefined,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const payload = await response.json()
      message = payload.error || payload.message || message
    } catch {
      // no-op
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  const type = response.headers.get('content-type') || ''
  if (type.includes('application/pdf')) return response.blob()
  return response.json()
}

export const api = {
  register: (payload) => request(AUTH_API_BASE, '/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request(AUTH_API_BASE, '/api/auth/login', { method: 'POST', body: payload }),
  me: (token) => request(AUTH_API_BASE, '/api/users/me', { token }),

  listLeads: (token, status) =>
    request(LEAD_API_BASE, status ? `/api/leads?status=${status}` : '/api/leads', { token }),
  getLeadPipeline: (token) => request(LEAD_API_BASE, '/api/leads/pipeline', { token }),
  createLead: (token, payload) => request(LEAD_API_BASE, '/api/leads', { method: 'POST', token, body: payload }),
  updateLeadStatus: (token, id, status) =>
    request(LEAD_API_BASE, `/api/leads/${id}/status`, { method: 'PATCH', token, body: { status } }),

  getEstimateDefaults: (token) => request(ESTIMATE_API_BASE, '/api/estimates/defaults', { token }),
  upsertEstimateDefaults: (token, payload) =>
    request(ESTIMATE_API_BASE, '/api/estimates/defaults', { method: 'PUT', token, body: payload }),
  createEstimate: (token, payload) =>
    request(ESTIMATE_API_BASE, '/api/estimates', { method: 'POST', token, body: payload }),
  listEstimates: (token) => request(ESTIMATE_API_BASE, '/api/estimates', { token }),
  updateEstimateStatus: (token, id, status) =>
    request(ESTIMATE_API_BASE, `/api/estimates/${id}/status`, { method: 'PATCH', token, body: { status } }),

  createJob: (token, payload) => request(JOB_API_BASE, '/api/jobs', { method: 'POST', token, body: payload }),
  listJobs: (token, status) =>
    request(JOB_API_BASE, status ? `/api/jobs?status=${status}` : '/api/jobs', { token }),
  getJob: (token, id) => request(JOB_API_BASE, `/api/jobs/${id}`, { token }),
  updateJobStatus: (token, id, payload) =>
    request(JOB_API_BASE, `/api/jobs/${id}/status`, { method: 'PATCH', token, body: payload }),
  updateJobSchedule: (token, id, payload) =>
    request(JOB_API_BASE, `/api/jobs/${id}/schedule`, { method: 'PATCH', token, body: payload }),

  createInvoice: (token, payload) => request(INVOICE_API_BASE, '/api/invoices', { method: 'POST', token, body: payload }),
  listInvoices: (token, status) =>
    request(INVOICE_API_BASE, status ? `/api/invoices?status=${status}` : '/api/invoices', { token }),
  getInvoice: (token, id) => request(INVOICE_API_BASE, `/api/invoices/${id}`, { token }),
  updateInvoiceStatus: (token, id, status) =>
    request(INVOICE_API_BASE, `/api/invoices/${id}/status`, { method: 'PATCH', token, body: { status } }),
  recordInvoicePayment: (token, id, amount) =>
    request(INVOICE_API_BASE, `/api/invoices/${id}/payments`, { method: 'PATCH', token, body: { amount } }),

  createNotification: (token, payload) =>
    request(NOTIFICATION_API_BASE, '/api/notifications', { method: 'POST', token, body: payload }),
  listNotifications: (token, status) =>
    request(NOTIFICATION_API_BASE, status ? `/api/notifications?status=${status}` : '/api/notifications', { token }),
  updateNotificationStatus: (token, id, payload) =>
    request(NOTIFICATION_API_BASE, `/api/notifications/${id}/status`, { method: 'PATCH', token, body: payload }),
  sendNotificationNow: (token, id) =>
    request(NOTIFICATION_API_BASE, `/api/notifications/${id}/send`, { method: 'POST', token }),
  getFollowUpRule: (token) => request(NOTIFICATION_API_BASE, '/api/notifications/follow-up-rule', { token }),
  upsertFollowUpRule: (token, payload) =>
    request(NOTIFICATION_API_BASE, '/api/notifications/follow-up-rule', { method: 'PUT', token, body: payload }),
  triggerPendingEstimateFollowUp: (token, payload) =>
    request(NOTIFICATION_API_BASE, '/api/notifications/follow-ups/estimates/pending', { method: 'POST', token, body: payload }),

  getAnalyticsSummary: (token) => request(ANALYTICS_API_BASE, '/api/analytics/summary', { token }),
  getEstimatorPerformance: (token) => request(ANALYTICS_API_BASE, '/api/analytics/estimators', { token }),
  getLeadSourcePerformance: (token) => request(ANALYTICS_API_BASE, '/api/analytics/lead-sources', { token }),
  getAnalyticsHistory: (token) => request(ANALYTICS_API_BASE, '/api/analytics/history', { token }),
  seedAnalytics: (token, payload) => request(ANALYTICS_API_BASE, '/api/analytics/seed', { method: 'POST', token, body: payload }),
}
