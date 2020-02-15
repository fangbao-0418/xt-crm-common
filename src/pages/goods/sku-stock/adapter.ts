import { statusEnums } from './config';
import { SkuStockFormProps } from './form';
import { initImgList } from '@/util/utils';

export function replaceHttpUrl(imgUrl?: string) {
  return (imgUrl || '')
    .replace('https://assets.hzxituan.com/', '')
    .replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
};

// 数组转换到字符串
function array2String(list: any[]) {
  return (list || []).map((item: any) => replaceHttpUrl(item.url)).join(',');
}

// 字符串转数组
function string2Array(value: string) {
  return (value || '').split(',').reduce((prev: any[], curr) => prev.concat(initImgList(curr)), [])
}

// 过滤上传组件请求或者响应
export function filterUploadFile(
  data: any,
  type: 'req' | 'res' = 'req',
  fields: string[] = ['videoCoverUrl', 'videoUrl', 'coverUrl', 'productImage', 'bannerUrl', 'listImage']
) {
  fields.forEach(name => {
    data[name] = type === 'req' ? array2String(data[name]) : string2Array(data[name]);
  })
  return data;
}

// 过滤金额
export function filterMoney(
  data: any,
  type: 'req' | 'res' = 'req',
  fields: string[] = ['marketPrice', 'costPrice']
) {
  fields.forEach(name => {
    data[name] = type === 'req' ?
      APP.fn.formatMoneyNumber(data[name]) :
      APP.fn.formatMoneyNumber(data[name], 'm2u');
  })
  return data;
}

// 过滤列表响应
export function listResponse(res: any) {
  res.records = (res.records || []).map((record: any) => {
    record.statusText = statusEnums[record.status];
    record.createTimeText = APP.fn.formatDate(record.createTime);
    record.modifyTimeText = record.modifyTime ? APP.fn.formatDate(record.modifyTime): '-'
  })
  return res;
}

// 过滤新增、编辑表单
export function requestPayload(payload: SkuStockFormProps) {
  let result: Record<string, any> = {};
  result = filterUploadFile(payload)
  result.skuAddList = (payload.skuAddList || []).map(item => {
    item = filterMoney(item);
    return item;
  })
  return { ...payload, ...result };
}

// 过滤详情响应
export function detailResponse(res: any) {
  let result: Record<string, any> = {};
  result = filterUploadFile(res, 'res');
  res.skuAddList = (res.skuAddList || []).map((item: any) => {
    item = filterMoney(item, 'res');
    return item;
  })
  return res;
}