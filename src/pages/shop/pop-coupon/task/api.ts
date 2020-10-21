const { get, newPost } = APP.http

interface TaskListPayload {
  /** 业务平台：0-优选，1-买菜 */
  businessPlatform: 0 | 1
  /** 券任务发送开始时间 */
  sendTimeStart: number
  /** 券任务发送结束时间 */
  sendTimeEnd: number
  /** 发送状态(0: 未执行, 1: 执行中, 2: 已执行, 3: 停止,4:失败) */
  status: number
  /** 券任务名称支持模糊 */
  name: string

}
export const fetchTaskList = (payload: Partial<TaskListPayload>) => {
  return newPost('/mcweb/coupon/shop/task/getPage', payload)
}

interface AddTaskPayload {
  name: string
  couponIds: any[]
  /** 操作行为(1: 发券, 2: 失效优惠券) */
  operateBehavior: 1 | 2
  /** 优惠券展示样式(1: 普通, 2: 定制),默认普通 */
  displayStyle: 1 | 2
  /** 目标用户群体(0: 全部, 1: 用户等级, 2: 指定用户, 3: 文件) */
  receiveUserGroup: 0 | 1 | 2 | 3
  userGroupValue: any
  /** 发送时间 单位毫秒 */
  executionTime: number
}
export const addTask = (payload: Partial<AddTaskPayload>) => {
  return newPost('/mcweb/coupon/shop/task/add', payload)
}

/** 编辑任务 */
export const updateTask = (payload: Partial<AddTaskPayload>) => {
  return newPost('/mcweb/coupon/shop/task/update', payload)
}

export const fetchTaskDetail = (id: any) => {
  return get(`/mcweb/coupon/shop/task/getById?id=${id}`)
}

/** 优惠券列表 */
export const fetchCouponList = (payload: {
  codes: any[]
  page?: number
  pageSize?: number
}) => {
  return newPost('/mcweb/coupon/pop/list', payload)
}

/** 停止任务 */
export const stopTask = (id: any) => {
  return newPost('/mcweb/coupon/shop/task/stop', {
    id
  })
}

/** 失效任务 */
export const invalidateTask = (id: any) => {
  return newPost('/mcweb/coupon/shop/task/invalidate', {
    id
  })
}