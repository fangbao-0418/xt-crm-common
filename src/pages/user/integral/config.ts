/*
 * @Date: 2020-04-29 10:33:20
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-29 10:33:42
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/template/list-page/config.ts
 */
import { OptionProps } from '@/packages/common/components/form'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      memberId: {
        type: 'input',
        label: '用户ID',
        controlProps: {
          type: 'number'
        }
      },
      orderCode: {
        type: 'input',
        label: '订单号'
      },
      mainType: {
        label: '状态',
        type: 'select',
        options: [
          { label: '获取', value: 0 },
          { label: '使用', value: 1 },
          { label: '过期', value: 2 }
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
