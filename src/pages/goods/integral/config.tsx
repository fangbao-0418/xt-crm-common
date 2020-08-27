import React from 'react'
import { OptionProps } from '@/packages/common/components/form'
import SelectFetch from '@/packages/common/components/select-fetch'
import SuppilerSelector from '@/components/supplier-selector'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}

function getRatioOptions () {
  const options = []
  let i = 0
  while (i < 100) {
    options.push({
      label: `${i}%`,
      value: i
    })
    i++
  }
  return options
}

export function getFieldsConfig (): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      productName: {
        type: 'input',
        label: '商品名称'
      },
      productId: {
        type: 'input',
        label: '商品ID',
        controlProps: {
          type: 'number'
        }
      },
      store: {
        label: '供应商',
        type: 'input',
        inner: (form) => {
          return form.getFieldDecorator('store')(
            <SuppilerSelector type='yx' style={{ width: 172 }} />
          )
        }
      },
      status: {
        type: 'select',
        label: '状态',
        options: [
          { label: '已上架', value: 0 },
          { label: '已下架', value: 1 }
        ]
      },
      exchangeRate: {
        label: '可抵扣比例',
        type: 'select',
        inner: (form) => {
          return form.getFieldDecorator('exchangeRate')(
            <SelectFetch
              showSearch
              options={getRatioOptions()}
            />
          )
        }
      }
    }
  }
  return defaultConfig
}

export enum StatusEnum {
  已上架 = 1,
  已下架 = 0,
  商品池 = 2,
  待上架 = 3
}