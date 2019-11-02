declare namespace Message {
  interface ItemProps {
    /** 发送结束时间 */
    endTime: string
    /** 消息状态(0-待发送，2-进行中,3-已取消,4-已完成) */
    messageStatus: 0 | 2 | 3 | 4
    /** 消息标题 */
    messageTitle: string
    /** 消息通道(0-push(信鸽默认)，10-站内信) */
    messageType: 0 | 10
  }
}