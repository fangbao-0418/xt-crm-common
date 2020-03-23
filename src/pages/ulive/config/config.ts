/*
 * @Date: 2020-03-06 17:18:26
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-23 16:22:36
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/ulive/config/config.ts
 */
import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    tag: {
      title: {
        type: 'input', label: '名称',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '标签名称不能为空'
            },
            {
              max: 5,
              message: '标签名称最大5个字符'
            }
          ]
        }
      },
      sort: {
        type: 'number', label: '排序',
        controlProps: {
          precision: 0,
          min: 0
        },
        fieldDecoratorOptions: {
          initialValue: 0
        }
      }
    },
    carousel: {
      id: {
        type: 'number', label: '场次ID',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '场次ID不能为空'
            }
          ]
        }
      },
      carouselSort: {
        type: 'number', label: '排序',
        controlProps: {
          precision: 0,
          min: 0
        },
        fieldDecoratorOptions: {
          initialValue: 0
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}

/** 直播状态枚举 */
export enum LiveStatusEnum {
  '预告-待审核' = 10,
  '预告-未过审' = 20,
  '预告-已过期' = 30,
  '预告-禁播' = 40,
  '停播-运营停播' = 50,
  '已结束' = 60,
  '预告-待开播' = 70,
  '即将开始' = 80,
  '直播中' = 90
}
