import { batchExportPayload } from './api'

export function batchExportRequest(payload: batchExportPayload) {
  const expressNumbers = payload.expressNumbers.replace(/\n+/g, ',').replace(/\s+/g, '').replace(/^,|,$/g, '')
  return { ...payload, expressNumbers };
}