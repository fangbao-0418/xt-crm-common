import { OptionProps } from '@/packages/common/components/form'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      productName: {
        type: 'input',
        label: '商品名称'
      },
      auditStatus: {
        type: 'select',
        label: '审核状态',
        controlProps: {
          style: {
            width: '174px'
          }
        },
        options: [
          {
            label: '全部',
            value: -1
          },
          {
            label: '待审核',
            value: 1
          },
          {
            label: '审核通过',
            value: 2
          },
          {
            label: '审核不通过',
            value: 3
          }
        ]
      },
      createTime: {
        type: 'rangepicker',
        label: '创建时间',
        controlProps: {
          showTime: true
        }
      },
      auditTime: {
        type: 'rangepicker',
        label: '审核时间',
        controlProps: {
          showTime: true
        }
      },
      id: {
        type: 'input',
        label: '申请单ID',
        controlProps: {
          type: 'number'
        }
      }
    }
  }
  return defaultConfig
}

export const auditStatusConfig = {
  '-1': '全部',
  '1': '待审核',
  '2': '审核通过',
  '3': '审核不通过'
}