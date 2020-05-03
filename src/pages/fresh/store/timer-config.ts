import { FieldsConfig } from '@/packages/common/components/form'

export const NAME_SPACE = 'store-timer'
export const defaultConfig: FieldsConfig = {
  'store-timer': {
    workDate: {
      label: '生效时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    },
    actionType: {
      label: '类型',
      type: 'select',
      controlProps: {
        style: {
          width: 172
        }
      },
      options: [{ value: 1, label: '上线' }, { value: 0, label: '下线' }]
    },
    actionStatus:{
      label: '状态',
      type: 'select',
      controlProps: {
        style: {
          width: 172
        }
      },
      options: [{ value: 0, label: '关闭' }, { value: 1, label: '开启' }]
    }
  }
}
