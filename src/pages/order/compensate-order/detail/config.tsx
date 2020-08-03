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

export function getApplInfo () {
  return [
    {
      label: '补偿原因',
      value: 'Zhou Maomao',
      span: 1,
      type: 'text'
    },
    {
      label: '发起人',
      value: 'Zhou Maomao',
      span: 1,
      type: 'text'
    },
    {
      label: '补偿类型',
      value: 'Zhou Maomao',
      span: 1,
      type: 'text'
    },
    {
      label: '补偿归属',
      value: 'Zhou Maomao',
      span: 1,
      type: 'text'
    },
    {
      label: '补偿金额',
      value: 'Zhou Maomao',
      span: 2,
      type: 'text'
    },
    {
      label: '转账方式',
      value: 'Zhou Maomao',
      span: 2,
      type: 'text'
    },
    {
      label: '姓名',
      value: 'Zhou Maomao',
      span: 2,
      type: 'text'
    },
    {
      label: '转账账号',
      value: 'Zhou Maomao',
      span: 2,
      type: 'text'
    },
    {
      label: '补偿凭证',
      value: 'https://assets.hzxituan.com/small-store-logo/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551587803910284.png',
      span: 2,
      type: 'image'
    },
    {
      label: '补偿说明',
      value: 'Zhou Maomao',
      span: 2,
      type: 'text'
    }
  ]
}