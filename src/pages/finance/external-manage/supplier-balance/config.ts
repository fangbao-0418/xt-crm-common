import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      supperId: {
        label: '商家ID',
        type: 'input',
        controlProps: {
          placeholder: '请输入商家ID'
        }
      },
      supplierName: {
        label: '商家名称',
        type: 'input',
        controlProps: {
          placeholder: '请输入商家名称'
        }
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
