import React from 'react'
import SelectFetch from '@/packages/common/components/select-fetch'
import UploadView from '@/components/upload'
import { OptionProps } from '@/packages/common/components/form/index'
import * as api from '../../api'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      operateType: {
        label: '处理方式',
        type: 'radio',
        controlProps: {
          style: {
            width: 236
          }
        },
        options: [{
          label: '同意',
          value: 3
        }, {
          label: '拒绝',
          value: 2
        }],
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '处理方式必须选择' }
          ],
          initialValue: 3
        }
      },
      responsibilityType: {
        label: '责任归属',
        type: 'select',
        options: [{
          label: '商家',
          value: 10
        }, {
          label: '平台',
          value: 20
        }, {
          label: '仓配',
          value: 30
        }, {
          label: '客服',
          value: 40
        }],
        controlProps: {
          allowClear: false
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '请选择责任归属' }
          ]
        }
      },
      compensateAmount: {
        type: 'number',
        label: '金额修改',
        controlProps: {
          style: {
            width: 236
          },
          min: 0.01
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '金额修改不能为空' }
          ]
        }
      },
      couponCode: {
        label: '优惠券',
        inner: (form) => {
          return form.getFieldDecorator('couponCode', {
            rules: [
              { required: true, message: '优惠券必须选择' }
            ]
          })(
            <SelectFetch
              allowClear={false}
              showSearch
              style={{ width: '100%' }}
              optionFilterProp='children'
              filterOption={(input, option) => {
                return (option.props.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
              placeholder='请选择'
              fetchData={() => {
                return api.getCouponsAllList({ orderBizType: 0 }).then((res: any) => {
                  return (res || []).map((item: any) => {
                    const result = item.faceValue.split(':')
                    return {
                      label: `满${(result[0] / 100) || 0}减${(result[1] / 100) || 0}`,
                      value: item.code
                    }
                  })
                })
              }}
            />
          )
        }
      },
      transferEvidenceImgs: {
        label: '补偿凭证',
        inner: (form) => {
          return form.getFieldDecorator('transferEvidenceImgs', {
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
              listNum={3}
              size={2}
            />
          )
        }
      },
      remarks: {
        type: 'textarea',
        label: '备注说明',
        controlProps: {
          maxLength: 200
        }
      },
      receiptorAccountName: {
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