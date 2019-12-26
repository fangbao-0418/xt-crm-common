import Decimal from 'decimal.js'
/** 开启团购会个人权限 */
export function enablePermissionParams (payload: any) {
  const result: any = {}
  result.isOpen = payload.isOpen ? 0 : 1
  return {
    ...payload,
    ...result
  }
}

/** 修改保证金金额 */
export function depositAmountParams (payload: any) {
  const result: any = {}
  result.depositAmount = new Decimal(payload.depositAmount || 0).mul(100).toNumber()
  return {
    ...payload,
    ...result
  }
}

/** 修改授权金额 */
export function creditAmountParams (payload: any) {
  const result: any = {}
  result.creditAmount = new Decimal(payload.creditAmount || 0).mul(100).toNumber()
  return {
    ...payload,
    ...result
  }
}

/** 会员详情 */
export function userInfoResponse (res: any) {
  res.creditAmount = res.creditAmount / 100
  res.depositAmount = res.depositAmount / 100
  res.remainCreditAmount = res.remainCreditAmount / 100
  return res
}