export const INVOICE_PROGRESS_RANGE = [0.35, 0.6]

export const INVOICE_BASE_SUBTOTAL = 9000

export const INVOICE_GST_RATE = 0.18

export function getInvoiceStage(progress) {
  if (progress < 0.2) return 'Stage: Waiting'
  if (progress < 0.45) return 'Stage: Client attached'
  if (progress < 0.7) return 'Stage: Tax computed'
  return 'Stage: Ready to send'
}
