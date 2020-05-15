import { filterMoney, filterUploadFile } from '../sku-stock/adapter';
import { SkuSaleProps } from '../components/sku';
import { replaceHttpUrl } from '../sku-stock/adapter';
import { replaceHttpUrl as addonPrefix} from '@/util/utils';
import { statusEnums } from '../sku-stock/config';
import { omit } from 'lodash';

const fields: string[] = ['costPrice', 'salePrice', 'marketPrice', 'cityMemberPrice', 'managerMemberPrice', 'areaMemberPrice', 'headPrice'];

// 过滤新增、编辑销售商品请求
export function formRequest(payload: any) {
  console.log('payload =>', payload)
  // 组合商品默认是入库商品
  if (payload.isGroup) {
    payload.warehouseType = 1;
  }
  const skuList: SkuSaleProps[] = payload.skuList || [];
  let result: Record<string, any> = filterUploadFile(payload)

  console.log('result !!!!!!!!!!!!!', result);
  result.skuAddList = skuList.map(item => {
    item = filterMoney(item, 'req', fields);
    item.imageUrl1 = replaceHttpUrl(item.imageUrl1);
    if (payload.warehouseType === 1) {
      item.deliveryMode = 1;
    }
    if (Array.isArray(item.productBasics)) {
      item.productBasics = item.productBasics.map((v: any) => {
        v.productBasicSpuCode = v.productBasicSpuCode || v.productCode;
        return v;
      })
    }
    if (!payload.isGroup) {
      item.num = item.num || 1;
    }
    return item;
  });
  result.freightTemplateId = +payload.freightTemplateId
  result.firstCategoryId = payload.categoryId?.[0]
  result.secondCategoryId = payload.categoryId?.[1]
  result.thirdCategoryId = payload.categoryId?.[2]
  result.categoryId = payload.categoryId?.[2]
  return omit({ ...payload, ...result }, 'skuList')
}

// 过滤销售商品详情
export function formResponse(res: any) {
  const skuList: any[] = res.skuList || [];
  res = filterUploadFile(res || {}, 'res');
  const { productCategoryVO } = res;
  if (productCategoryVO) {
    res.categoryId = productCategoryVO.id;
    res.combineName = productCategoryVO.combineName;
    res.categoryName = productCategoryVO.name;
  }
  res.skuList = skuList.map((item: any) => {
    item = filterMoney(item, 'res', fields);
    return item;
  });
  res.showImage = !!skuList.find(v => !!v.imageUrl1);
  res.freightTemplateId = res.freightTemplateId ? res.freightTemplateId + '' : '';
  res.status = +res.status;
  res.productCustomsDetailVOList = res.productCustomsDetailVOList || [];
  res.warehouseType = res.warehouseType ? 1 :  0;
  return res;
}

// 过滤库存商品详情响应
export function baseProductResponse(res: any) {
  res = filterUploadFile(res, 'res');
  const skuList: any[] = res.skuList || [];
  const { productCategoryVO } = res;

  if (productCategoryVO) {
    res.categoryId = productCategoryVO.id;
    res.combineName = productCategoryVO.combineName;
    res.categoryName = productCategoryVO.name;
  }
  res.skuList = skuList.map(item => {
    const result = filterMoney(item, 'res');
    result.productBasicBarCode = item.barCode;
    result.productBasicSkuCode = item.skuCode;
    result.productBasicSpuCode = res.productCode;
    // 所有入库商品默认仓库发货，不再进行发货方式的编辑
    result.deliveryMode = 1;
    return { ...omit(item, ['barCode', 'skuCode']), ...result};
  })
  res.showImage = skuList.every(v => !!v.imageUrl1);
  return omit(res, 'productCategoryVO');
}

// 过滤库存
export function baseProductPageResponse(res: any) {
  res.records = (res.records || []).map((item: any) => {
    item.statusText = statusEnums[item.status];
    item.productMainImage = addonPrefix(item.coverUrl);
    item.productBasicSkuInfos = (item.productBasicSkuInfos || []).map((v: any) => {
      return {
        ...v,
        costPrice: APP.fn.formatMoneyNumber(v.costPrice, 'm2u'),
        marketPrice: APP.fn.formatMoneyNumber(v.marketPrice, 'm2u')
      }
    });
    return item;
  });
  return res;
}

// 过滤销售商品SKU中库存商品详情
export function baseSkuDetailResponse(res: any) {
  return (res || []).map((item: any) => {
    item = filterMoney(item, 'res')
    return {
      ...omit(item, ['productBasicName', 'stock', 'productBasicMainImage', 'productBasicId', 'propertyInfo']),
      productBasicSpuCode: item.productBasicSpuCode,
      propertyValue: item.propertyInfo,
      id: item.productBasicId,
      productName: item.productBasicName,
      totalStock: item.stock,
      productMainImage: item.productBasicMainImage
    }
  });
}