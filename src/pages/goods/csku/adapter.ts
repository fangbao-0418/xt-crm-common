import { statusEnums } from './config';
export function listResponse(res: any) {
  res.records = (res.records || []).map((record: any) => {
    record.statusText = statusEnums[record.status];
    record.createTimeText = APP.fn.formatDate(record.createTime);
    record.modifyTimeText = record.modifyTime ? APP.fn.formatDate(record.modifyTime): '-'
  })
  return res;
}