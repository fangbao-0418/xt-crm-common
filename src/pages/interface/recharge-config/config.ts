/*
 * @Date: 2020-04-29 10:33:20
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-15 15:22:18
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/interface/recharge-config/config.ts
 */
import { OptionProps } from '@/packages/common/components/form'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      id: {
        type: 'input',
        label: '申请单ID',
        controlProps: {
          type: 'number'
        }
      },
      storeNameLike: {
        type: 'input',
        label: '供应商名称'
      },
      storeId: {
        label: '供应商ID',
        type: 'input',
        controlProps: {
          type: 'number'
        }
      },
      operator: {
        type: 'input',
        label: '操作人'
      },
      operateTime: {
        type: 'rangepicker',
        label: '操作时间',
        controlProps: {
          showTime: true
        }
      },
      payType: {
        type: 'select',
        label: '提现方式',
        options: [
          { label: '个人银行卡', value: 3 },
          { label: '对公账号', value: 4 }
        ]
      },
      createTime: {
        type: 'rangepicker',
        label: '创建时间',
        controlProps: {
          showTime: true
        }
      }
    }
  }
  return defaultConfig
}

/** 商品sku状态 */
export enum StatusEnum {
  下架 = 0,
  上架 = 1,
  删除 = -1,
  商品池 = 2,
  待上架 = 3
}