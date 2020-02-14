import { SkuProps } from "../components/sku";

// 过滤新增、编辑销售商品请求
export function requestPayload(payload: any) {
  return payload;
}

// 过滤销售商品详情
export function detailResponse(res: any) {
  const skuList: SkuProps[] = res.skuList || [];
  res.skuList = skuList.map(item => {
    item.costPrice = APP.fn.formatMoneyNumber(item.costPrice, 'm2u');
    item.salePrice = APP.fn.formatMoneyNumber(item.salePrice, 'm2u');
    item.marketPrice = APP.fn.formatMoneyNumber(item.marketPrice, 'm2u');
    item.cityMemberPrice = APP.fn.formatMoneyNumber(item.cityMemberPrice, 'm2u');
    item.managerMemberPrice =  APP.fn.formatMoneyNumber(item.managerMemberPrice, 'm2u');
    item.areaMemberPrice = APP.fn.formatMoneyNumber(item.areaMemberPrice, 'm2u');
    item.headPrice = APP.fn.formatMoneyNumber(item.headPrice, 'm2u');
    return item;
  });
  return res;
}