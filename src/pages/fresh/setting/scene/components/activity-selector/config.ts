import React from 'react'
import { OptionProps } from '@/packages/common/components/form/index'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      name: {
        type: 'input',
        label: '活动名称'
      },
      promotionId: {
        type: 'number',
        label: '活动ID',
        controlProps: {
          style: {
            width: 200
          }
        }
      },
      productName: {
        type: 'input',
        label: '商品名称'
      },
      productId: {
        type: 'number',
        label: '商品ID',
        controlProps: {
          style: {
            width: 200
          }
        }
      },
      // type: {
      //   type: 'select',
      //   label: '活动类型',
      //   options: [
      //     { label: '限时秒杀', value: 50 },
      //     { label: '场景活动', value: 51 }
      //   ]
      // },
      status: {
        type: 'select',
        label: '活动状态',
        options: [
          { label: '关闭', value: 0 },
          { label: '开启', value: 1 }
        ]
      },
      time: {
        type: 'rangepicker',
        label: '有效时间'
      }
    }
  }
  return defaultConfig
}

export enum ActivityTypeEnum {
  限时秒杀 = 50,
  场景活动 = 51
}
