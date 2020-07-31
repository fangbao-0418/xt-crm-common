import React from 'react'
import UploadView from '@/components/upload'
import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      compensateStatus: {
        label: '处理方式',
        type: 'radio',
        controlProps: {
          style: {
            width: 236
          }
        },
        options: [{
          label: '同意',
          value: 1
        }, {
          label: '拒绝',
          value: 0
        }],
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '处理方式必须选择' }
          ]
        }
      },
      responsibilityType: {
        label: '责任归属',
        type: 'select',
        controlProps: {
          style: {
            width: 236
          }
        },
        options: [{
          label: '喜团补偿',
          value: 1
        }, {
          label: '供应商补偿',
          value: 0
        }],
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '责任归属必须选择' }
          ]
        }
      },
      compensateAmount: {
        type: 'number',
        label: '金额修改',
        controlProps: {
          style: {
            width: 236
          }
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '金额修改不能为空' }
          ]
        }
      },
      illustrate: {
        label: '补偿凭证',
        inner: (form) => {
          return form.getFieldDecorator('illustrate', {
            rules: [
              {
                required: true,
                message: '请上传补偿凭证'
              }
            ]
          })(
            <UploadView
              ossType='cos'
              placeholder='请上传'
              listType='picture-card'
              listNum={1}
              size={0.3}
            />
          )
        }
      },
      remarks: {
        type: 'textarea',
        label: '备注说明'
      },
      recepitorAccountName: {
        label: '姓名',
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '姓名不能为空' }
          ]
        }
      },
      receiptorAccountNo: {
        label: '转账账号',
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '转账账号不能为空' }
          ]
        }
      }
    }
  }
  return defaultConfig
}
