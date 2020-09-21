export interface CouponTaskList {
  /** 任务ID */
  id: any
  /** 任务名称 */
  name: string
  /** 用户类型 0: 全部, 1: 用户等级, 2: 指定用户, 3: 文件 */
  receiveUserGroup: 0 | 1 | 2 | 3
  /** 用户类型对应的值 */
  userGroupValue: any
  /** 发送时间 */
  sendStartTime: number
  /** 领取人数 */
  receiveNum: number
  /** 发送状态(0: 未开始, 1: 进行中, 2: 已结束, 3: 已停止,4: 已失效) */
  status: number
  codes: string[]
}