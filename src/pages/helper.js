import format from 'date-fns/format';
import moment from 'moment';
import receiveRestrictType from '@/enum/receiveRestrictType';
import { isNil } from 'lodash';

export function formatDate(date, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '';
  return format(date, dateFormat);
}

export function formatMoney(money) {
  if (!money) return 0;
  return money / 100;
}

export function formatMoneyWithSign(money, decimal = 2, sign = '￥') {
  return `￥${formatMoney(money).toFixed(decimal)}`;
}

export function unionAddress(args) {
  const { province = '', city = '', area = '', street = '' } = args || {};
  return `${province}${city}${area}${street}`;
}

export const formatMoneyBeforeRequest = price => {
  if (isNil(price)) {
    return price;
  }

  const pasred = parseFloat(price);
  if (isNaN(pasred)) {
    return undefined;
  }

  return (pasred * 100).toFixed();
};


// 计算steps组件第几步了
export const calcCurrent = refundStatus => {
  let current = 0;
  if (refundStatus === 10) {
    current = 0;
  }
  if (refundStatus >= 20 && refundStatus < 30) {
    current = 1;
  }
  if (refundStatus === 30 || refundStatus === 40) {
    current = 2;
  }
  return current;
}


// 格式化退货信息
export const joinFilterEmpty = (arr) => {
  return arr.filter(Boolean).join(' ');
}

// 是仅退款
export function isOnlyRefund(refundType) {
  return refundType === 20;
}

// 退货退款
export function isReturnOfGoodsAndMoney(refundType) {
  return refundType === 10;
}

// 仅换货
export function isOnlyExchange(refundType) {
  return refundType === 30;
}


// 待审核状态
export function isPendingStatus(orderRefunds) {
  return orderRefunds === 10;
}

// 在处理中
export function isProcessingStatus(orderRefunds) {
  return orderRefunds === 20;
}

// 退款失败状态
export function isRefundFailedStatus(orderRefunds) {
  return orderRefunds === 21;
}

// 退货退款中
export function isReturnOfGoodsAndMoneyStatus(orderRefunds) {
  return orderRefunds === 22;
}

// 换货中
export function isInExchangeStatus(orderRefunds) {
  return orderRefunds === 24;
}


// 格式化面值
export function formatFaceValue(record) {
  let result = [];
  switch (record.useSill) {
    // 无门槛
    case 0:
      return `无门槛${record.faceValue}`;
    // 满减
    case 1:
      result = record.faceValue.split(':');
      return `满${result[0]}减${result[1]}`;
    // 折顶(打折,限制最多优惠金额))
    case 2:
      return;
    default:
      result = record.faceValue ? record.faceValue.split(':') : [];
      return `满${result[0]}减${result[1]}`;
  }
}

export function formatRangeTime(val = []) {
  return val.map(v => moment(+v).format('YYYY-MM-DD HH:mm')).join(' ~ ')
}

// 领取时间
export function formatDateRange({ startReceiveTime, overReceiveTime }) {
  return formatRangeTime([startReceiveTime, overReceiveTime])
}

// 用券时间
export function formatUseTime({ useTimeType, useTimeValue }) {
  switch (useTimeType) {
    case 0:
      return formatRangeTime(useTimeValue.split(','));
    case 1:
      break;
    default:
      break;
  }
}

// 格式化适用范围
export function formatAvlRange(val = 0) {
  const applicationScope = {
    0: '全场通用',
    1: '类目商品',
    2: '指定商品',
    4: '指定活动'
  }
  return applicationScope[val];
}

// 领取人限制
export function formatReceiveRestrict(val = '') {
  return val.split(',').map(v => receiveRestrictType.getValue(v)).join('，');
}