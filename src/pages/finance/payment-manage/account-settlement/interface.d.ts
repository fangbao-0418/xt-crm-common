export interface ListRecordProps {
  /** 账务结算ID */
  id: any
  /** 收支类型 */
  inOrOutTypeDesc: string
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
}