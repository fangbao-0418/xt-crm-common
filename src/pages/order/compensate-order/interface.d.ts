export interface OrderProps {
  id: string|number
}

export interface Detail {
  compensateCode: string
  isCanCancel: boolean
  isCanAudit: boolean
  reasonType: string
  reasonName: string
  compensateAmount: string
  /* 审核状态 */
  compensateStatus: string
  /* 审核状态名称 */
  compensateStatusName: string
  couponCode: string
  couponName: string
  /* 卡券使用期限 */
  couponUsefulLift: string
  /* 补偿凭证，三方流水 */
  thirdTransferSn: string
  /* 补偿说明 */
  illustrate: string
  responsibilityType: number
  responsibilityName: string
  compensatePayType: string
  compensatePayName: string
  receiptorAccountNo: stirng
  recepitorAccountName: string
  creatorId: string
  creatorName: string
  /* 订单业务类型 0-喜团订单，10-买菜订单	 */
  orderBizType: number
}