import { Decimal } from 'decimal.js';

type PlainObj = {
  [key: string]: any;
};
interface BaseVO {
  baseVO: PlainObj;
}
interface RuleVO {
  ruleVO: PlainObj;
}

/** 优惠券详情响应 */
export function couponDetailResponse({ baseVO, ruleVO }: BaseVO & RuleVO) {
  return {
    name: baseVO.name,
    inventory: baseVO.inventory,
    useTimeType: baseVO.useTimeType,
    description: baseVO.description,
    remark: baseVO.remark,
    receivePattern: baseVO.receivePattern,
    avlRange: ruleVO.avlRange,
    useSill: ruleVO.useSill,
    // discountConditions:
    // discountPrice:
    // receiveTime:
    showFlag: ruleVO.showFlag
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
  vals.discountConditions = new Decimal(vals.discountConditions).mul(100).toNumber();
  vals.discountPrice = new Decimal(vals.discountPrice).mul(100).toNumber();
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

const getPlatformRestrictValues = (vals: any) => {
  console.log('platformType=>', vals.platformType);
  // 不限制
  if (vals.platformType === 0) {
    return 'all';
  }
  // 选择平台
  else {
    return vals.platformRestrictValues.join(',');
  }
};

const getDailyRestrict = (vals: any) => {
  return vals.dailyRestrictChecked ? vals.dailyRestrict : '';
};

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
  const [startReceiveTime, overReceiveTime] = Array.isArray(params.receiveTime)
    ? params.receiveTime.map((v: any) => v && v.valueOf())
    : [];
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
      startReceiveTime,
      // 结束领取时间
      overReceiveTime,
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
