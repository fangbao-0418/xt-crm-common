import { FieldsConfig } from '@/packages/common/components/form'
export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    groupByStock: {
      productId: {
        type: 'number',
        label: '商品ID',
        controlProps: {
          style: {
            width: 172
          }
        }
      },
      productName: {
        type: 'input',
        label: '商品名称'     
      },
      pruchaseTime: {
        type: 'rangepicker',
        label: '采购时间',
        controlProps: {
          showTime: true
        }
      }
    }
  }
  return defaultConfig
}