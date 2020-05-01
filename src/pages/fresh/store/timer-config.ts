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
    }
  }
}
