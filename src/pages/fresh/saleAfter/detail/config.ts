import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      auditOperation: {
        type: 'radio',
        label: '处理结果',
        options: [
          { label: '同意', value: 0 },
          { label: '不同意', value: 1 }
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
      refundReason: {
        type: 'select',
        label: '审核原因',
        options: [
          { label: '其他', value: 0 },
          { label: '商品质量有问题', value: 10 },
          { label: '没收到商品', value: 11 },
          { label: '仓库发错货', value: 12 },
          { label: '仓库少发漏发', value: 13 },
          { label: '实物与描述不符', value: 14 },
          { label: '商品损坏', value: 15 },
          { label: '商品配送延迟', value: 16 }
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
      toWarehouse: {
        type: 'radio',
        label: '是否需要送回仓库',
        options: [
          { label: '需要', value: 0 },
          { label: '不需要', value: 1 }
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
      auditRefundAmount: {
        type: 'input',
        label: '退款金额',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '退款金额不能为空'
            }
          ]
        },
        controlProps: {
          style: {
            width: '180px'
          }
        }
      },
      auditAuditInfo: {
        type: 'textarea',
        label: '说明',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请输入说明'
            }
          ]
        },
        controlProps: {
          style: {
            width: '360px'
          }
        }
      }
    }
  }
  return defaultConfig
}
