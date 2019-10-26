import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      title: {
        type: 'input', label: '消息标题'
      },
      type: {
        type: 'select', label: '消息类型',
        options: [
          {label: '系统消息', value: '0'},
          {label: '营销消息', value: '1'}
        ] 
      },
      status: {
        type: 'select', label: '状态',
        options: [
          {label: '待发送', value: '0'},
          {label: '发送失败', value: '1'},
          {label: '发送成功', value: '2'},
          {label: '已取消', value: '4'}
        ] 
      },
      sendTime: {
        type: 'rangepicker', label: '发送时间',
        controlProps: {
          //
        }
      },
      ways: {
        type: 'select', label: '状态',
        options: [
          {label: '短信', value: '0'},
          {label: 'push', value: '1'},
          {label: '站内信', value: '2'}
        ] 
      },
      content: {
        type: 'textarea', label: '内容'
      },
      jumpUrl: {
        type: 'input', label: '跳转链接'
      }
    }
  }
  return defaultConfig
}
