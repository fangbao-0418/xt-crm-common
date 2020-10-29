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
      type: {
        type: 'select',
        label: '举报类型',
        options: [
          { label: '广告内容', value: 1 },
          { label: '不友善内容', value: 2 },
          { label: '造谣传谣', value: 3 },
          { label: '违法违规', value: 4 },
          { label: '色情低俗', value: 5 },
          { label: '其他', value: 6 },
        ]
      },
      status: {
        type: 'select',
        label: '举报理由',
        options: [
          { label: '待审核', value: 1 },
          { label: '举报成功', value: 2 },
          { label: '举报失败', value: 3 }
        ]
      },
      description: {
        type: 'textarea',
        label: '举报描述'
      },
      productId: {
        type: 'number',
        label: '商品ID'
      },
      feedbackWord: {
        type: 'textarea',
        label: '处理结果反馈'
      },
      createTime: {
        label: '举报时间',
        type: 'rangepicker'
      }
    }
  }
  return defaultConfig
}

export enum TypeEnum {
  '广告内容' = 1 ,
  '不友善内容' = 2,
  '造谣传谣' = 3,
  '违法违规' = 4,
  '色情低俗' = 5,
  '其他' = 6,
}

export enum StatusEnum {
  '待审核' = 1 ,
  '举报成功' = 2,
  '举报失败' = 3
}
