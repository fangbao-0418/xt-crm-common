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
        controlProps: {
          style: {
            width: 200
          }
        }
      },
      sort: {
        type: 'number',
        label: '排序',
        controlProps: {
          style: {
            width: 200
          }
        }
      },
      productCategoryVOS: {
        label: '关联商品',
        inner: (form) => {
          return form.getFieldDecorator('productCategoryVOS')(
            <RelevanceGoods />
          )
        }
      }
    }
  }
  return defaultConfig
}
