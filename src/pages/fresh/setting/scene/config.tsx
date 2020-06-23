import React from 'react'
import { OptionProps } from '@/packages/common/components/form/index'
import RelevanceGoods from './components/relevance-goods'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      name: {
        type: 'input',
        label: '场景名称',
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '场景名称必填' },
            { max: 5, message: '场景名称最多支持5个字符' }
          ]
        },
        controlProps: {
          style: {
            width: 200
          }
        }
      },
      sort: {
        type: 'number',
        label: '排序',
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '请输入排序' }
          ]
        },
        controlProps: {
          min: 1,
          style: {
            width: 200
          }
        }
      },
      productCategoryVOS: {
        label: '关联商品',
        inner: (form) => {
          return form.getFieldDecorator('productCategoryVOS', {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value || value.length === 0) {
                    cb('请选择活动')
                  }
                  cb()
                }
              }
            ]
          })(
            <RelevanceGoods />
          )
        }
      }
    }
  }
  return defaultConfig
}
