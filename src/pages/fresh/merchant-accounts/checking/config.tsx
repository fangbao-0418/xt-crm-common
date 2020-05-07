/*
 * @Date: 2020-04-29 10:33:20
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-04 16:28:08
 * @FilePath: /xt-crm/src/pages/fresh/merchant-accounts/checking/config.tsx
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
        type: 'number',
        label: '对账单ID',
        controlProps: {
          style: {
            width: 150
          }
        }
      },
      supplierName: {
        type: 'input',
        label: '供应商名称'
      },
      supplierId: {
        label: '供应商ID',
        type: 'number',
        controlProps: {
          style: {
            width: 150
          }
        }
      },
      productId: {
        type: 'number',
        label: '商品ID',
        controlProps: {
          style: {
            width: 150
          }
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
