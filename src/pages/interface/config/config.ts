import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig:FieldsConfig  = {
    /** 直播 */
    live: {
      /** 直播频道展示 */
      a1: {
        type: 'radio', label: '直播频道展示',
        options: [
          {label: '不展示', value: '1'},
          {label: '使用默认配置', value: '2'},
          {label: '自定义配置', value: '3'}
        ],
        fieldDecoratorOptions: {
          initialValue: '1'
        }
      },
      e: {
        type: 'input', label: '直播主标题颜色',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请输入直播主标题颜色',
            },
            {
              max: 20,
              message: '直播主标题颜色字符不得大于20个字符',
            }
          ]
        },
        controlProps: {
          style: {
            width: 300
          }
        }
      },
      f: {
        type: 'input', label: '直播副标题颜色',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请输入直播副标题颜色',
            },
            {
              max: 20,
              message: '直播副标题颜色字符不得大于20个字符',
            }
          ]
        },
        controlProps: {
          style: {
            width: 300
          }
        }
      },
      g: {
        type: 'input', label: '直播副标题文字',
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请输入直播副标题文字',
            },
            {
              max: 8,
              message: '直播副标题文字字符不得大于8个字符',
            }
          ]
        },
        controlProps: {
          style: {
            width: 300
          }
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}
