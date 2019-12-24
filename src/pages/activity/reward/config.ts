
export function getDefaultConfig () {
  const defaultConfig = {
    reward: {
      activityType: {
        label: '活动类型'
      },
      name: {
        label: '活动名称'
      },
      orderNo: {
        label: '主订单号'
      },
      phone: {
        label: '下单手机号'
      },
      status: {
        label: '状态'
      },
      awardType: {
        label: '奖品类型'
      }
    }
  }
  return defaultConfig
}

export enum statusEnum {
  '已使用' = 0,
  '未使用' = 1,
  '已过期' = 2,
  '已失效' = 3
}