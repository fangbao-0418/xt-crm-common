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
    phone: {
      label: '手机号', 
      type: 'number',
      controlProps: {
        style: {
          width: 200
        },      
        maxLength: 11

      }
    },
    status: {
      label: '状态',
      type: 'select',
      options: [{
        label: '未缴纳',
        value: 1
      }, {
        label: '待认领',
        value: 2
      }, {
        label: '已认领',
        value: 3
      }]
    },
    createTime: {
      label: '设置时间',
      type: 'rangepicker'
    }
  }
}