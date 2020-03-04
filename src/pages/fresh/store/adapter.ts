import { statusEnum, shopTypeEnum } from './config';
import { omit } from 'lodash';

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
  const result: any = {};
  // 省市区
  const [provinceCode, cityCode, areaCode] = payload.address;
  result.provinceCode = provinceCode;
  result.cityCode = cityCode;
  result.areaCode = areaCode;

  return { ...omit(payload, 'address'), ...result};
}