import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      messageTitle: {
        type: 'input', label: '消息标题',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '消息标题不能为空'
            },
            {
              max: 20,
              message: '标题长度不能大于20个字符'
            }
          ]
        }
      },
      type: {
        type: 'select', label: '消息类型',
        options: [
          {label: '系统消息', value: '0'},
          {label: '营销消息', value: '1'}
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '消息类型不能为空'
            }
          ]
        }
      },
      messageStatus: {
        type: 'select', label: '状态',
        options: [
          {label: '待发送', value: '0'},
          {label: '已取消', value: '3'},
          {label: '进行中', value: '2'},
          {label: '已完成', value: '4'}
        ]
      },
      groupType: {
        type: 'select', label: '',
        options: memberOptions
      },
      sendTime: {
        type: 'rangepicker', label: '发送时间',
        controlProps: {
          showTime: true
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '发送时间不能为空'
            }
          ]
        }
      },
      messageType: {
        type: 'select', label: '消息通道',
        options: [
          {label: 'push', value: '0'},
          {label: '站内信', value: '10'}
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择消息通道'
            }
          ]
        }
      },
      messageContent: {
        type: 'textarea', label: '内容',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '推送内容不能为空'
            },
            {
              max: 140,
              message: '推送内容不能超过140个字符'
            }
          ]
        }
      },
      jumpUrl: {
        type: 'input', label: '跳转链接'
      }
    }
  }
  return defaultConfig
}

export const memberOptions = [
  {
    label: '全部',
    value: 'all'
  },
  {
    label: '普通会员',
    value: 0
  },
  {
    label: '团长',
    value: 10
  },
  {
    label: '社区管理员',
    value: 20
  },
  {
    label: '城市合伙人',
    value: 30
  },
  {
    label: '管理员',
    value: 40
  }
]

/** 消息状态枚举 */
export enum statusEnum {
  待发送 = 0,
  已取消 = 3,
  进行中 = 2,
  已完成 = 4
}

/** 任务状态枚举 */
export enum taskStatusEnum {
  未发送 = 0,
  发送成功 = 1,
  正在发送 = 2,
  发送异常 = 3,
  取消发送 = 4
}

/** 消息类型枚举 */
export enum typeEnum {
  push = 0,
  站内信 = 10
}