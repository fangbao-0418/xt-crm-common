import format from 'date-fns/format';
import { isNil } from 'lodash';

export function formatDate(date, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
  if(!date) return '';
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