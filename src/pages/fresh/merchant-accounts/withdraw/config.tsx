/*
 * @Date: 2020-04-28 16:04:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-04 19:56:07
 * @FilePath: /xt-crm/src/pages/fresh/merchant-accounts/withdraw/config.tsx
 */
import { OptionProps } from '@/packages/common/components/form'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      code: {
        type: 'input',
        label: '申请单编号'
      },
      supplierName: {
        type: 'input',
        label: '供应商名称'
      },
      supplierUid: {
        label: '供应商ID',
        type: 'number',
        controlProps: {
          style: {
            width: 150
          }
        }
      },
      operator: {
        type: 'input',
        label: '操作人'
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
        label: '申请时间',
        controlProps: {
          showTime: true
        }
      },
      operateTime: {
        type: 'rangepicker',
        label: '操作时间',
        controlProps: {
          showTime: true
        }
      }
    }
  }
  return defaultConfig
}

/** 提现方式 */
export enum PayTypeEnum {
  个人银行卡 = 3,
  对公账号 = 4
}

/** 提现状态 */
export enum StatusEnum {
  待提现 = 5,
  提现成功 = 15,
  提现失败 = 25
}