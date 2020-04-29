import { statusEnums } from './config';
import { SkuStockFormProps } from './form';
import { initImgList } from '@/util/utils';
import { pick } from 'lodash';

export function replaceHttpUrl(imgUrl?: string) {
  return (imgUrl || '')
    .replace('https://assets.hzxituan.com/', '')
    .replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '')
    .replace('https://sh-tximg.hzxituan.com/', '');
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
  const result: any = {};
  fields.forEach(name => {
    result[name] = type === 'req' ?
      array2String(data[name]) :
      string2Array(data[name]);
  })
  return { ...data, ...result};
}

// 过滤金额
export function filterMoney(
  data: any,
  type: 'req' | 'res' = 'req',
  fields: string[] = ['marketPrice', 'costPrice']
) {
  let result: any = {};
  fields.forEach(name => {
    result[name] = type === 'req' ?
      APP.fn.formatMoneyNumber(data[name]) :
      APP.fn.formatMoneyNumber(data[name], 'm2u');
  })
  return { ...data, ...result };
}

// 过滤列表响应
export function listResponse(res: any) {
  res.records = (res.records || []).map((record: any) => {
    record.statusText = statusEnums[record.status];
    record.createTimeText = APP.fn.formatDate(record.createTime);
    record.modifyTimeText = record.modifyTime ? APP.fn.formatDate(record.modifyTime): '-'
    return record;
  })
  return res;
}

// 过滤新增、编辑表单
export function formRequest(payload: SkuStockFormProps) {
  let result: Record<string, any> = filterUploadFile(payload);
  result.categoryId = Array.isArray(payload.categoryId) ? payload.categoryId[2] : '';
  result.skuAddList = (payload.skuAddList || []).map(item => {
    return filterMoney(item);
  })
  return { ...payload, ...result };
}

// 过滤详情响应
export function formResponse(res: any) {
  res = filterUploadFile(res, 'res');
  const skuList: any[] = res.skuList || []
  res.skuList = skuList.map(item => {
    item = filterMoney(item, 'res');
    return item;
  })
  res.showImage = skuList.some(v => !!v.imageUrl1);
  return res;
}


// 传入销售商品skuList数据返回库存商品skuList数据
export function filterSkuList(list: any[]) {
  return (list || []).map(item => {
    return pick(item, [
      'unit',
      'barCode',
      'costPrice',
      'imageUrl1',
      'marketPrice',
      'propertyValue1',
      'propertyValue2',
      'skuCode',
      'skuName',
      'status',
      'stock',
      'productBasicSkuId',
      'productBasicId'
    ]);
  })
}