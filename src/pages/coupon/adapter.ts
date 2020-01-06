import { Decimal } from 'decimal.js';
import moment from 'moment';
import { uniq } from 'lodash';

type Description = {
  [key: string]: any;
}

type DataType = 'baseVO' | 'ruleVO'

const initialValue = { baseVO: {}, ruleVO: {}}

/** 满减条件 */
const parseFaceValue = (faceValue: string | null) => {
  let discountConditions: number | undefined
  let discountPrice: number | undefined
  let faceValueArr = (faceValue || '').split(':')
  if (faceValueArr.length === 2) {
    [discountConditions, discountPrice] = faceValueArr.map((val: string) => val ? +val / 100 : 0)
  }
  return { discountConditions, discountPrice }
}

interface RangeVOItem {
  id: number;
  name: string;
}
// 指定活动表格数据
function getActivityList(data: RangeVOItem[]) {
  return data.map((item: RangeVOItem) => ({
    id: item.id,
    title: item.name,
    ...item
  }))
}

// 已选择商品/排除商品
function getProductList(data: RangeVOItem[]) {
  return (data || []).map((item: RangeVOItem) => ({
    id: item.id,
    productName: item.name
  }))
}

// 获取类目
function getCategorys(data: RangeVOItem[]) {
  return data.map((item: RangeVOItem) => String(item.id))
}

function translate({ rangeVOList, avlRange }: Description) {
  let categorys: any[] = [];
  let chosenProduct: any[] = [];
  let activityList: any[] = [];
  if (Array.isArray(!rangeVOList)) rangeVOList = [];
  switch(avlRange) {
    case 1:
      categorys = getCategorys(rangeVOList);
      break;
    case 2:
      chosenProduct = getProductList(rangeVOList);
      break;
    case 4:
      activityList = getActivityList(rangeVOList);
      break;
  }
  return {
    categorys,
    chosenProduct,
    activityList
  }
}

/** 优惠券详情响应 */
export function couponDetailResponse(res: Record<DataType, Description>) {
  const { baseVO, ruleVO } = res || initialValue
  const { discountConditions, discountPrice } = parseFaceValue(ruleVO.faceValue)

  let useTimeRange: any[] = []
  let availableDays: number | undefined
  if (ruleVO.useTimeType === 1) {
    availableDays = parseFloat(ruleVO.useTimeValue) 
    availableDays = isNaN(availableDays) ? undefined : + availableDays
  } else if (ruleVO.useTimeType === 0) {
    const useTimeArr = (ruleVO.useTimeValue || '').split(',').map((num: string) => +num)
    // 指定时间段
    useTimeRange = useTimeArr.map((v: any) => moment(v))
  }

  let platformType: number
  let platformRestrictValues: any[] = []
  if (ruleVO.platformRestrict === 'all') {
    platformType = 0
  } else {
    platformType = 1
    platformRestrictValues = (ruleVO.platformRestrict || '').split(',')
  }

  let recipientLimit: number | undefined
  let receiveRestrictValues: any[] = []
  if (ruleVO.receiveRestrict === 'all') {
    recipientLimit = 0
  } else {
    const arr = (ruleVO.receiveRestrict || '').split(',').map((num: string) => +num)
    if (arr.length > 1) {
      recipientLimit = 1
      receiveRestrictValues = arr
    } else {
      recipientLimit = isNaN(+ruleVO.receiveRestrict) ? undefined : +ruleVO.receiveRestrict
    }
  }
  const {
    chosenProduct,
    activityList,
    categorys
  } = translate(res.ruleVO)

  console.log('useTimeRange ---------------------', useTimeRange)
  return {
    name: baseVO.name,
    inventory: baseVO.inventory,
    description: baseVO.description,
    remark: baseVO.remark,
    receivePattern: ruleVO.receivePattern === 1,
    avlRange: ruleVO.avlRange,
    useSill: ruleVO.useSill,
    discountConditions,
    discountPrice,
    startReceiveTime: ruleVO.startReceiveTime,
    overReceiveTime: ruleVO.overReceiveTime,
    showFlag: ruleVO.showFlag,
    useTimeType: ruleVO.useTimeType,
    useTimeRange,
    availableDays,
    restrictNum: ruleVO.restrictNum,
    dailyRestrict: ruleVO.dailyRestrict,
    dailyRestrictChecked: !!ruleVO.dailyRestrict,
    platformType,
    platformRestrictValues,
    recipientLimit,
    receiveRestrictValues,
    excludeProduct: getProductList(ruleVO.excludeProductVOList),
    chosenProduct,
    activityList,
    categorys
  }
}

// 根据适用范围获取范围值
const getAvlValues = (vals: any) => {
  let result = '';
  switch (vals.avlRange) {
    case 0:
      break;
    // 已选择类目
    case 1:
      result = vals.categorys.join(',');
      break;
    // 已选择商品id
    case 2:
      result = Array.isArray(vals.chosenProduct) ? vals.chosenProduct.map((v: any) => v.id).join(',') : ''
      break;
    // 已选择活动id
    case 4:
      result = Array.isArray(vals.activityList) ? vals.activityList.map((v: any) => v.id).join(',') : ''
      break;
    default:
      break;
  }
  return result;
};

const getExcludeValues = (vals: any) => {
  let avlRangeStr = Array.isArray(vals.excludeProduct) ? vals.excludeProduct.map((v: any) => v.id).join(',') : '';
  return vals.avlRange !== 2 ? avlRangeStr : '';
};

const getFaceValue = (vals: any) => {
  vals.discountConditions = new Decimal(vals.discountConditions || 0).mul(100).toNumber();
  vals.discountPrice = new Decimal(vals.discountPrice || 0).mul(100).toNumber();
  console.log(`${vals.discountConditions}:${vals.discountPrice}`);
  switch (vals.useSill) {
    case 0:
      return vals.discountPrice;
    case 1:
      return `${vals.discountConditions}:${vals.discountPrice}`;
    default:
      return '';
  }
};

const getReceiveRestrictValues = (vals: any) => {
  // 不限制
  if (vals.recipientLimit === 0) {
    return 'all';
  } else if (vals.recipientLimit === 1) {
    let result = vals.receiveRestrictValues.includes(30)
      ? [...vals.receiveRestrictValues, 40]
      : vals.receiveRestrictValues;
    return uniq(result).join(',');
  } else {
    return vals.recipientLimit;
  }
};

const getPlatformRestrictValues = (vals: any) => vals.platformType === 0 ? 'all' : vals.platformRestrictValues.join(',')

const getDailyRestrict = (vals: any) => vals.dailyRestrictChecked ? vals.dailyRestrict : null

const getUseTimeValue = (vals: any) => {
  if (vals.useTimeType === 0) {
    let result = Array.isArray(vals.useTimeRange) ? vals.useTimeRange.map((v: any) => v && v.valueOf()) : [];
    return result.join(',');
  } else {
    return vals.availableDays;
  }
};

/** 优惠券详情入参 */
export function couponDetailParams(params: any) {
  return {
    baseVO: {
      // 名称
      name: params.name,
      // 总量
      inventory: params.inventory,
      // 备注
      remark: params.remark,
      description: params.description
    },
    ruleVO: {
      // 限领
      restrictNum: params.restrictNum,
      // 适用范围
      avlRange: params.avlRange,
      // 范围值
      avlValues: getAvlValues(params),
      // 排除商品
      excludeValues: getExcludeValues(params),
      // 优惠券类型
      useSill: params.useSill,
      // 优惠券价值
      faceValue: getFaceValue(params),
      // 领取/使用用户级别限制
      receiveRestrictValues: getReceiveRestrictValues(params),
      // 平台限制
      platformRestrictValues: getPlatformRestrictValues(params),
      // 每日限领
      dailyRestrict: getDailyRestrict(params),
      // 开始领取时间
      startReceiveTime: params.startReceiveTime,
      // 结束领取时间
      overReceiveTime: params.overReceiveTime,
      receivePattern: params.receivePattern ? 1 : 0,
      // 商详显示
      showFlag: params.receivePattern ? 0 : params.showFlag,
      // 适用时间类型
      useTimeType: params.useTimeType,
      // 使用时间值
      useTimeValue: getUseTimeValue(params)
    }
  };
}
