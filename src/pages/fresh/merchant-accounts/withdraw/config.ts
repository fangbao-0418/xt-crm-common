/*
 * @Date: 2020-04-28 16:04:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-28 16:22:49
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/merchant-accounts/withdraw/config.ts
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
      type: {
        type: 'select',
        label: '供应商名称',
        options: [
          { label: '短信', value: 20 },
          { label: 'PUSH', value: 0 },
          { label: '站内信', value: 10 },
          { label: '服务号', value: 30 },
          { label: '小程序', value: 40 }
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择模板类型'
            }
          ]
        }
      },
      storeId: {
        type: 'number',
        label: '供应商ID'
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
