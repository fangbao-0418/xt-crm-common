export interface ListRecordProps {
  /** 账务结算ID */
  id: any
  /** 收支类型描述 */
  inOrOutTypeDesc: string
  /** 收支类型，1=收入 2=支出 */
  inOrOutType: 1 | 2
  /** 账务金额 */
  amount: number
  /** 账务对象ID */
  subjectId: any
  /** 账务对象名称 */
  subjectName: string
  /** 创建时间 */
  createTime: number
  /** 审核完成时间 */
  auditFinishTime: number
  /** 原因 */
  applicationRemark: string
  /** 财务对象类型 */
  subjectTypeDesc: string
  /** 审核状态：0=待审核,1=审核通过,2=审核不通过 */
  auditStatus: 0 | 1 | 2
  /** 结算状态，-2=结算关闭 -1=冻结中 0=待结算 1=结算中 2=已结算 */
  settlementStatus: -2 | -1 | 0 | 1 | 2
}