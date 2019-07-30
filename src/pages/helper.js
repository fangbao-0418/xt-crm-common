import format from 'date-fns/format';
import { isNil } from 'lodash';

export function formatDate(date, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
  if(!date) return '';
  return format(date, dateFormat);
}

export function formatMoney(money) {
  return money / 100;
}

export function formatMoneyWithSign(money, decimal = 2, sign = '￥') {
  return `￥${formatMoney(money).toFixed(decimal)}`;
}

export function unionAddress({ province = '', city = '', area = '', street = '' }) {
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
