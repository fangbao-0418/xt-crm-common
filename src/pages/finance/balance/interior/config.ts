import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      subjectType: {
        label: '供应商类型',
        type: 'select',
        options: [
          { label: '供应商', value: 1 },
          { label: '喜团小店', value: 2 },
          { label: 'pop店', value: 3 }
        ]
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}

export enum SupplierTypeEnum {
  个人供应商 = 1,
  企业供应商 = 2,
  个体工商户供应商 = 3
}
