import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      withdrawalCode: {
        label: '申请单编号',
        type: 'input',
        controlProps: {
          style: { width: 180 },
          placeholder: '请输入申请单编号'
        }
      },
      supplierName: {
        type: 'input',
        label: '供应商名称',
        controlProps: {
          placeholder: '请输入供应商名称'
        }
      },
      supplierId: {
        label: '供应商ID',
        type: 'number',
        controlProps: {
          style: { width: 180 },
          placeholder: '请输入供应商ID'
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
      accountIdCardAddress: {
        type: 'select',
        label: '提现方式',
        controlProps: {
          placeolder: '请选择提现方式'
        },
        options: [
          { label: '个人银行卡', value: '1' },
          { label: '对公账户', value: '73' }
        ]
      },
      withdrawalDate: {
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
  喜团优选 = 0,
  喜团小店 = 6,
  POP店 = 7
}