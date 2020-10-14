import format from 'date-fns/format'
import moment from 'moment'
import receiveRestrictType from '@/enum/receiveRestrictType'
import platformType from '@/enum/platformType'
import { isNil } from 'lodash'

export function formatDate (date, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) {
    return ''
  }
  return format(date, dateFormat)
}

export function formatMoney (money) {
  if (!money) {
    return 0
  }
  return money / 100
}

export function formatMoneyWithSign (money, decimal = 2, sign = '￥') {
  // return `￥${formatMoney(money).toFixed(decimal)}`;
  return APP.fn.formatMoney(money)
}

export function unionAddress (args) {
  const { province = '', city = '', district = '', street = '' } = args || {}
  return `${province}${city}${district}${street}`
}

export const formatMoneyBeforeRequest = price => {
  if (isNil(price)) {
    return price
  }

  const pasred = parseFloat(price)
  if (isNaN(pasred)) {
    return undefined
  }

  return (pasred * 100).toFixed()
}

// 格式化退货信息
export const joinFilterEmpty = arr => {
  return arr.filter(Boolean).join(' ')
}

// 格式化面值
export function formatFaceValue (record) {
  let result = []
  switch (record.useSill) {
    // 无门槛
    case 0:
      return `无门槛${record.faceValue}`
    // 满减
    case 1:
      result = record.faceValue.split(':')
      return `满${(result[0] / 100) || 0}减${(result[1] / 100) || 0}`
    // 折顶(打折,限制最多优惠金额))
    case 2:
      return
    default:
      result = record.faceValue ? record.faceValue.split(':') : []
      return `满${(result[0] / 100) || 0}减${(result[1] / 100) || 0}`
  }
}

export function formatRangeTime (val = [], pattern = 'YYYY-MM-DD HH:mm', separator = ' ~ ') {
  return val.map(v => moment(+v).format(pattern)).join(separator)
}

// 领取时间
export function formatDateRange ({ startReceiveTime, overReceiveTime }, pattern, separator) {
  return formatRangeTime([startReceiveTime, overReceiveTime], pattern, separator)
}

// 用券时间
export function formatUseTime ({ useTimeType, useTimeValue }, pattern, separator) {
  switch (useTimeType) {
    case 0:
      return formatRangeTime(useTimeValue.split(','), pattern, separator)
    case 1:
      return `领取当日起${useTimeValue}天内可用`
    default:
      break
  }
}

// 格式化渠道
export function formatbizType (val = 0) {
  const applicationScope = {
    0: '优选',
    1: '买菜',
    2: '好店'
  }
  return applicationScope[val]
}
// 格式化适用范围
export function formatAvlRange (val = 0) {
  const applicationScope = {
    0: '全场通用',
    1: '类目商品',
    2: '指定商品',
    4: '指定会场',
    5: '全店通用'
  }
  return applicationScope[val]||'未知'
}

// 领取人限制
export function formatReceiveRestrict (val = '') {
  if (val === 'all') {
    return '不限制'
  } else if (val === '3') {
    return '平台未下单用户'
  }
  return val
    .split(',')
    .map(v => receiveRestrictType.getValue(v))
    .join('，')
}

// 格式化使用平台
export const formatPlatformRestrict = (val = '') => {
  if (val === 'all') {
    return '不限制'
  }
  return val
    .split(',')
    .map(v => platformType.getValue(v))
    .join('，')
}

// 今天之前不可选
export function disabledDate (current) {
  return (
    current
    && current
      < moment()
        .endOf('day')
        .subtract(1, 'days')
  )
}

// 一个月之后不可选
export function afterDisabledDate (current) {
  return (
    current
    && current
      > moment()
        .startOf('day')
        .add(31, 'days')
  )
}
