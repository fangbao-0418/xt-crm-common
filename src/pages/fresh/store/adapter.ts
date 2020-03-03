import { statusEnum, shopTypeEnum } from './config';

// 过滤列表响应
export function listResponse(res: any) {
  res.records = (res.records || []).map((record: any) => {
    record.statusText = statusEnum[record.status];
    record.shopTypeText = shopTypeEnum[record.shopType];
    record.createTimeText = APP.fn.formatDate(record.createTime);
    return record;
  })
  return res;
}

// 过滤表单请求
export function formRequest(payload: any) {
  return payload;
}