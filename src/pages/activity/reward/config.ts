import { typeOptions } from '../lottery/config'

export function getDefaultConfig () {
  const defaultConfig = {
    reward: {
      type: {
        label: '活动类型', type: 'select',
        options: typeOptions
      },
      title: {
        label: '活动名称'
      },
      luckyDrawRoundId: {
        label: '场次ID'
      },
      roundTitle: {
        label: '场次名称'
      },
      orderCode: {
        label: '主订单号'
      },
      phone: {
        label: '下单手机号'
      },
      status: {
        label: '状态', type: 'select',
        options: [
          {label: '未使用', value: 0},
          {label: '已使用', value: 1},
          {label: '已失效', value: 2},
          {label: '已过期', value: 3},
        ]
      },
      awardType: {
        label: '奖品类型', type: 'select',
        options: [
          {label: '未领取', value: -1},
          {label: '优惠券', value: 1},
          {label: '元宝', value: 2},
          {label: '现金', value: 3},
          {label: '实物', value: 4}
        ]
      }
    }
  }
  return defaultConfig
}

/** 抽奖活动类型 */
export enum TypeEnum {
  '红包雨' = 1,
  '九宫格抽奖' = 2,
  砸金蛋 = 3,
  财神拜年 = 4,
  '团长特殊晋升活动' = 5,
  '区长发底薪' = 6
}

/** 状态 */
export enum StatusEnum {
  '未使用' = 0,
  '已使用' = 1,
  '已失效' = 2,
  '已过期' = 3
}

/** 奖品类型 */
export enum AwardTypeEnum {
  '未领取' = -1,
  '优惠券' = 1,
  '元宝' = 2,
  '现金' = 3,
  '实物' = 4
}