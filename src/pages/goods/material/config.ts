import { FieldsConfig } from '@/packages/common/components/form'

export const defaultConfig: FieldsConfig = {
  skuSale: {
    productId: {
      label: '商品ID',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    productName: {
      label: '商品名称'
    },
    author_phone: {
      label: '手机号',
      type: 'number',
      controlProps: {
        style: {
          width: 172
        }
      }
    },
    startCreate: {
      label: '发布时间',
      type: 'rangepicker',
      controlProps: {
        showTime: true
      }
    }
  }
}