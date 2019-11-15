declare namespace Message {
  interface ItemProps {
    id: any
    /** 发送结束时间 */
    endTime: string
    /** 消息状态(0-待发送，2-进行中,3-已取消,4-已完成) */
    messageStatus: 0 | 2 | 3 | 4
    /** 消息标题 */
    messageTitle: string
    /** 消息通道(0-push(信鸽默认)，10-站内信) */
    messageType: 0 | 10
    /** 发送开始时间 */
    sendTime: number
    /** 创建人 */
    createName: string
    /** 消息类型 0-营销消息 */
    messageForm: 0
    memberIds: any[]
    groupType?: any[]
    fileName: string
    fileUrl: string
  }

  /** 子任务属性 */
  interface TaskItemProps {
    /** 任务状态 0-未发送 1-发送成功" 2-正在发送 3-发送异常 4-取消发送 */
    pushType: number
    /** 任务名称 */
    jobTitle: string
    /** 任务总数 */
    jobCount: number
    sendTime: number
    jobId: any
  }

}