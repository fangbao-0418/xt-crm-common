import { FieldsConfig } from '@/packages/common/components/form'
export function getDefaultConfig () {
  const defaultConfig: FieldsConfig = {
    groupByStock: {
      id: {
        type: 'number',
        label: '商品ID',
        controlProps: {
          style: {
            width: 172
          }
        }
      },
      name: {
        type: 'input',
        label: '商品名称'     
      }
    }
  }
  return defaultConfig
}