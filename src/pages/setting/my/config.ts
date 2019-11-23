import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    mySetting: {
      publishTime: {
        type: 'rangepicker',
        label: '发布时间',
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
      env: {
        type: 'select',
        label: '已发环境',
        options: [
          {label: '全部', value: ''},
          {label: '正式环境', value: 'prod'},
          {label: '预发环境', value: 'pre-prod'}
        ]
      }
    }
  }
  return defaultConfig
}
