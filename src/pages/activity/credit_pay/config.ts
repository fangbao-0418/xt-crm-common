import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      productName: {
        type: 'input', label: '商品名称'
      },
      productId: {
        type: 'input', label: '商品ID',
        controlProps: {
          type: 'number'
        }
      },
      status: {
        type: 'select', label: '状态',
        options: [
          {label: '已上架', value: '0'},
          {label: '已下架', value: '1'}
        ] 
      },
      maxHbFqNum: {
        type: 'select', label: '最大分期期数',
        options: [
          {label: '三期', value: '3'},
          {label: '六期', value: '6'},
          {label: '十二期', value: '12'}
        ] 
      },
      maxFqSellerPercent: {
        type: 'select', label: '最大免息期数',
        options: [
          {label: '三期', value: '3'},
          {label: '六期', value: '6'},
          {label: '十二期', value: '12'}
        ] 
      },
    }
  }
  return defaultConfig
}
