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

export enum AnchorIdentityTypeEnum {
  供应商 = 20,
  公司 = 10,
  合作网红 = 30,
  代理 = 40
}

export enum AnchorLevelEnum {
  星级主播 = 10,
  普通主播 = 0
}