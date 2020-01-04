import { Decimal } from 'decimal.js';
import moment from 'moment';

type PlainObj = {
  [key: string]: any;
};
interface BaseVO {
  baseVO: PlainObj;
}
interface RuleVO {
  ruleVO: PlainObj;
}

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

/** 优惠券详情响应 */
export function couponDetailResponse(res: BaseVO & RuleVO) {
  const { baseVO, ruleVO } = res || initialValue
  const { discountConditions, discountPrice } = parseFaceValue(ruleVO.faceValue)

  let useTimeRange: any[] | undefined
  let availableDays: number | undefined
  if (ruleVO.useTimeType === 1) {
    availableDays = parseFloat(ruleVO.useTimeValue) 
    availableDays = isNaN(availableDays) ? undefined : + availableDays
  } else if (ruleVO.useTimeType === 0) {
    const useTimeArr = (ruleVO.useTimeValue || '').split(',')
    // 指定时间段
    useTimeRange = useTimeArr.map((v: any) => moment(v))
  }

  return {
    name: baseVO.name,
    inventory: baseVO.inventory,
    description: baseVO.description,
    remark: baseVO.remark,
    receivePattern: baseVO.receivePattern,
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
    dailyRestrict: ruleVO.dailyRestrict
  };
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
    return result.join(',');
  } else {
    return vals.recipientLimit;
  }
};

const getPlatformRestrictValues = (vals: any) => vals.platformType === 0 ? 'all' : vals.platformRestrictValues.join(',')

const getDailyRestrict = (vals: any) => vals.dailyRestrictChecked ? vals.dailyRestrict : ''

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
