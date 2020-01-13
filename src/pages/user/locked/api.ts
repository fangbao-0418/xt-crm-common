import { lockedListResponse } from './adapter';
const { newPost, get } = APP.http;

export interface lockedListRequestPaload {
  page: number;
  pageSize: number;
  phone?: number;
  eventCode?: number;
  startTime?: string;
  endTime?: string;
}

/** 粉丝记录列表 */
export function getLockedList(payload: lockedListRequestPaload) {
  return newPost('/member/locked/list', payload).then(lockedListResponse);
}

/** 粉丝时间类型列表 */
export function getEventsList(): Promise<{label: string, value: any}[]> {
  return get('/member/locked/events').then(res => {
    return res.map((item: any) => {
      return { label: item.describe, value: item.code }
    })
  })
}