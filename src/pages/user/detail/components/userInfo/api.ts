import * as adapter from './adapter'
const { newPost } = APP.http

/** 修改保证金金额 */
export function updateDepositAmount (payload: {
  depositAmount: number,
  memberId: number
}) {
  const req = adapter.depositAmountParams(payload)
  return newPost('/member/account/groupBuy/updateDepositAmount', req)
}

/** 修改授权金额 */
export function updateCreditAmount (payload: {
  creditAmount: number,
  memberId: number
}) {
  const req = adapter.creditAmountParams(payload)
  return newPost('/member/account/groupBuy/updateCreditAmount', req)
}

/** 开启团购会个人权限 */
export function enablePermission (payload: {
  isOpen: boolean,
  memberId: number
}) {
  return newPost('/member/account/groupBuy/enablePermission', adapter.enablePermissionParams(payload))
}

/** 开启门店采购个人权限 */
export function enableShopPermission (payload: {
  enable: boolean,
  memberId: number
}) {
  return newPost('/member/store/purchase/switch', payload)
}
