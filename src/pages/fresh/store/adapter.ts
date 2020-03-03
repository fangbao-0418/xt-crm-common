import { statusEnum, shopTypeEnum } from './config';

export function listResponse(res: any) {
  res.records = (res.records || []).map((record: any) => {
    record.statusText = statusEnum[record.status];
    record.shopTypeText = shopTypeEnum[record.shopType];
    record.createTimeText = APP.fn.formatDate(record.createTime);
    return record;
  })
  return res;
}