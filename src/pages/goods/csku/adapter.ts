import { statusEnums } from './config';
import { CSkuFormProps } from './form';
import { initImgList } from '@/util/utils';

const replaceHttpUrl = (imgUrl: string) => {
  return (imgUrl || '').replace('https://assets.hzxituan.com/', '').replace('https://xituan.oss-cn-shenzhen.aliyuncs.com/', '');
};

// 数组转换到字符串
function array2String(list: any[]) {
  return (list || []).map((item: any) => replaceHttpUrl(item.url)).join(',');
}

// 字符串转数组
function string2Array(value: string) {
  return (value || '').split(',').reduce((prev: any[], curr) => prev.concat(initImgList(curr)), [])
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
export function requestPayload(payload: CSkuFormProps) {
  let result: { [key: string]: any } = {};
  const filterList: string[] = ['videoCoverUrl', 'videoUrl', 'coverUrl', 'productImage', 'bannerUrl', 'listImage'];
  filterList.forEach(name => {
    result[name] = array2String(payload[name]);
  })
  result.skuAddList = (payload.skuAddList || []).map(item => {
    // 市场价元转分
    item.marketPrice = APP.fn.formatMoneyNumber(item.marketPrice);
    // 成本价元转分
    item.costPrice = APP.fn.formatMoneyNumber(item.costPrice);
    return item;
  })
  return { ...payload, ...result };
}

// 过滤详情响应
export function detailResponse(res: any) {
  let result: { [key: string]: any } = {};
  const filterList: string[] = ['videoCoverUrl', 'videoUrl', 'coverUrl', 'productImage', 'bannerUrl', 'listImage'];
  filterList.forEach(name => {
    result[name] = string2Array(res[name]);
  })
  res.skuAddList = (res.skuAddList || []).map((item: any) => {
    // 市场价分转元
    item.marketPrice = APP.fn.formatMoneyNumber(item.marketPrice, 'm2u');
    // 成本价分转元
    item.costPrice = APP.fn.formatMoneyNumber(item.costPrice, 'm2u');
    return item;
  })
  return res;
}