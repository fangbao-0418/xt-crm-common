import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      messageTitle: {
        type: 'input', label: '消息标题'
      },
      type: {
        type: 'select', label: '消息类型',
        options: [
          {label: '系统消息', value: '0'},
          {label: '营销消息', value: '1'}
        ] 
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
      sendTime: {
        type: 'rangepicker', label: '发送时间',
        controlProps: {
          showTime: true
        }
      },
      messageType: {
        type: 'select', label: '消息通道',
        options: [
          {label: 'push', value: '0'},
          {label: '站内信', value: '10'}
        ] 
      },
      messageContent: {
        type: 'textarea', label: '内容'
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
    value: '1'
  },
  {
    label: '团长',
    value: '2'
  },
  {
    label: '社区管理员',
    value: '3'
  },
  {
    label: '城市合伙人',
    value: '4'
  },
]