/**
 * 适配表单入参
 * @param payload
 */
export function adpaterFormParams (payload: any) {
  const showStatus = payload.showStatus ? 1 : 2
  return {
    ...payload,
    showStatus
  }
}