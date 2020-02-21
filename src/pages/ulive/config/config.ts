import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'

export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      tagName: {
        type: 'input', label: '直播标题',
        fieldDecoratorOptions: {
          rules: [
            {
              pattern: /^\d{11}$/,
              message: '格式不正确'
            }
          ]
        }
      },
      tagSort: {
        type: 'number', label: '排序'
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
