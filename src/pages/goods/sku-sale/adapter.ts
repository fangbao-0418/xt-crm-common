import { filterMoney, filterUploadFile } from '../sku-stock/adapter';
import { SkuSaleProps } from '../components/sku';
import { replaceHttpUrl } from '../sku-stock/adapter';

const fields: string[] = ['costPrice', 'salePrice', 'marketPrice', 'cityMemberPrice', 'managerMemberPrice', 'areaMemberPrice', 'headPrice'];

// 过滤新增、编辑销售商品请求
export function formRequest(payload: any) {
  const skuList: SkuSaleProps[] = payload.skuList || [];
  let result: Record<string, any> = filterUploadFile(payload)
  result.skuList = skuList.map(item => {
    item = filterMoney(item, 'req', fields);
    item.imageUrl1 = replaceHttpUrl(item.imageUrl1);
    return item;
  });
  result.freightTemplateId = +payload.freightTemplateId;
  result.categoryId = Array.isArray(payload.categoryId) ? payload.categoryId[2] : '';
  return { ...payload, ...result };
}

// 过滤销售商品详情
export function formResponse(res: any) {
  const skuList: any[] = res.skuList || [];
  res = filterUploadFile(res || {}, 'res');
  res.skuList = skuList.map((item: any) => {
    item = filterMoney(item, 'res', fields);
    return item;
  });
  res.showImage = skuList.every(v => !!v.imageUrl1);
  res.freightTemplateId = res.freightTemplateId ? res.freightTemplateId + '' : '';
  res.status = +res.status;
  res.productCustomsDetailVOList = res.productCustomsDetailVOList || [];
  return res;
}