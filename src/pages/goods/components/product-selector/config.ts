import { FieldsConfig } from '@/packages/common/components/form'
export const defaultConfig: FieldsConfig = {
  productSelector: {
    productId:  {
      label: '商品ID'
    },
    productName: {
      label: '商品名称'
    },
    status: {
      label: '状态',
      type: 'select',
      options: [{
        label: '失效',
        value: 0
      }, {
        label: '正常',
        value: 1
      }, {
        label: '异常',
        value: 2
      }, {
        label: '售罄',
        value: 3
      }]
    }
  }
}