/*
 * @Date: 2020-04-29 10:33:20
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-02 19:45:49
 * @FilePath: /supplier/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/checking/config.tsx
 */
import React from 'react'
import { OptionProps } from '@/packages/common/components/form'
import MonthPicker from './components/MonthPicker'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      serialNo: {
        type: 'input',
        label: '对账单ID'
      },
      supplierName: {
        type: 'input',
        label: '供应商名称'
      },
      supplierId: {
        label: '供应商ID',
        type: 'input',
        controlProps: {
          type: 'number'
        }
      },
      productId: {
        type: 'input',
        label: '商品ID',
        controlProps: {
          type: 'number',
          placeholder: '请输入单据ID'
        }
      },
      date: {
        label: '月份',
        name: undefined,
        inner: (form) => {
          return form.getFieldDecorator(
            'date'
          )(
            <MonthPicker />
          )
        }
      }
    }
  }
  return defaultConfig
}
