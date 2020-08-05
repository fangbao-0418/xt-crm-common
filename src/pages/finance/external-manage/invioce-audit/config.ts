import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      fundTransferNo: {
        label: '申请单编号',
        type: 'input',
        controlProps: {
          style: { width: 180 },
          placeholder: '请输入申请单编号'
        }
      },
      supplierType: {
        type: 'select',
        label: '供应商类型',
        options: [
          { label: '喜团优选', value: 1 },
          { label: '喜团小店', value: 2 },
          { label: 'POP店', value: 3 }
        ],
        controlProps: {
          placeolder: '请选择供应商类型'
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择供应商类型'
            }
          ]
        }
      },
      createTime: {
        label: '创建时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}

export enum SupplierTypeEnum {
  喜团优选 = 1,
  喜团小店 = 2,
  POP店 = 3
}