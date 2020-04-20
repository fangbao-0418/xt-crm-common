import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      handleResult: {
        type: 'radio',
        label: '处理结果',
        options: [
          { label: '供应商发货', value: 0 },
          { label: '喜团发货', value: 1 }
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择处理结果'
            }
          ]
        }
      },
      auditReason: {
        type: 'select',
        label: '审核原因',
        options: [
          { label: '待审核', value: 1 },
          { label: '审核通过', value: 2 },
          { label: '审核不通过', value: 3 },
          { label: '待提交', value: 0 }
        ],
        controlProps: {
          style: {
            width: '180px'
          }
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择审核原因'
            }
          ]
        }
      },
      saleAfterNumber: {
        type: 'input',
        label: '售后数目',
        controlProps: {
          style: {
            width: '180px'
          }
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '售后数目不能为空'
            }
          ]
        }
      },
      refundAmount: {
        type: 'input',
        label: '退款金额',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '退款金额不能为空'
            }
          ]
        }
      },
      explain: {
        type: 'textarea',
        label: '说明',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请输入说明'
            }
          ]
        }
      }
    }
  }
  return defaultConfig
}
