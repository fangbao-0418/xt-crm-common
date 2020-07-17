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
          { label: '供应商', value: 1 },
          { label: '喜团小店', value: 2 }
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
      accountType: {
        type: 'select',
        label: '提现方式',
        controlProps: {
          placeolder: '请选择提现方式'
        },
        options: [
          { label: '支付宝', value: 'ALIPAY' },
          { label: '银行卡', value: 'BANK' },
          { label: '平安银行卡', value: 'PINGAN' }
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
  供应商 = 1,
  喜团小店 = 2
}