import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      name: {
        type: 'input', label: '名称',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请输入名称'
            },
            {
              max: 40,
              message: '名称40个字符，支持中英文数字'
            }
          ]
        }
      },
      date: {
        type: 'rangepicker', label: '时间',
        controlProps: {
          showTime: true
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '时间不能为空'
            }
          ]
        }
      },
      /** 位置 */
      location: {
        type: 'select', label: '位置',
        allValue: 0,
        options: [
          {label: '全部', value: 0},
          {label: '支付结果页', value: 1},
          {label: '个人中心', value: 2},
          {label: '购物车', value: 3},
          {label: '商品详情', value: 4}
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '位置不能为空'
            }
          ]
        }
      },
      displayFrom: {
        type: 'checkbox', label: '展示端',
        allValue: 0,
        options: [
          {label: '全部', value: 0},
          {label: 'ios', value: 8},
          {label: '安卓', value: 4},
          {label: '小程序', value: 2},
          {label: 'H5', value: 1}
        ]
      },
      status: {
        type: 'select', label: '活动时间',
        options: [
          {label: '全部', value: 0},
          {label: '支付结果页', value: 1},
          {label: '个人中心', value: 2},
          {label: '购物车', value: 3},
          {label: '商品详情', value: 4}
        ]
      }
    } 
  }
  return _.mergeWith(defaultConfig, partial)
}
