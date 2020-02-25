import { FieldsConfig } from '@/packages/common/components/form'
export const defaultConfig: FieldsConfig = {
  sprinkleCash: {
    // activityDate: {
    //   label: '活动日期',
    //   type: 'rangepicker',
    //   controlProps: {
    //     showTime: true
    //   },
    //   fieldDecoratorOptions: {
    //     rules: [{
    //       required: true,
    //       message: '请选择活动日期'
    //     }]
    //   }
    // },
    rule: {
      label: '活动规则',
      type: 'textarea',
      controlProps: {
        placeholder: '2000字以内',
        rows: 6,
        maxLength: 2000,
        style: {
          width: 500
        }
      },
      fieldDecoratorOptions: {
        rules: [{
          required: true,
          message: '请输入活动规则'
        }]
      }
    }
  }
}

export enum statusEnums {
  未开始 = 0,
  进行中 = 1,
  已结束 = 2,
  已关闭 = 3
}