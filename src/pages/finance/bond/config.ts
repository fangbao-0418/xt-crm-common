import { FieldsConfig } from '@/packages/common/components/form'
export const NAME_SPACE = 'bond'
export const defaultConfig: FieldsConfig = {
  bond: {
    supplierName: {
      label: '商家名称',
      controlProps: {
        style: {
          width: 200
        }
      }
    },
    supplierCategory: {
      label: '业务类型',
      type: 'select',
      options: [{
        label: '小店',
        value: 6
      }, {
        label: 'POP店',
        value: 7
      }]
    },
    createTime: {
      label: '设置时间',
      type: 'rangepicker'
    }
  }
}