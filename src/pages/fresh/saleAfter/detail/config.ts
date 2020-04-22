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
          { label: '地址/电话填写错误', value: 10 },
          { label: '优惠券未使用', value: 11 },
          { label: '买错/买多/不想要', value: 12 },
          { label: '订单拍错（规格/重量等）', value: 13 },
          { label: '订单破损/污渍/裂痕/变形', value: 14 },
          { label: '包装破损/污渍/裂痕/变形', value: 15 },
          { label: '品种/产地/规格/成分等与描述不符', value: 16 },
          { label: '商品腐烂/变质/死亡', value: 17 }
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
      auditServerNum: {
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
