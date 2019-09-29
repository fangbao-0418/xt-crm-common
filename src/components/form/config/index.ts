import _ from 'lodash'
import { OptionProps } from '../index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig = {
    common: {
    },
    /** 营销 */
    marketing: {
      startTime: {
        type: 'rangepicker', label: '活动时间'
      },
      createTime: {
        type: 'rangepicker', label: '创建时间'
      },
      title: {
        type: 'input', label: '活动名称',
        fieldDecoratorOptions: {
          rules: [
            {
              max: 20,
              message: '最多20个字符'
            }
          ]
        }
      },
      name: {
        type: 'input', label: '活动名称',
        fieldDecoratorOptions: {
          rules: [
            {
              max: 20,
              message: '最多20个字符'
            }
          ]
        }
      },
      activeTime: {
        type: 'rangepicker', label: '创建时间'
      },
      userScope: {
        type: 'checkbox', label: '目标用户',
        options: [
          {label: '全部', value: 'all'},
          {label: '管理员', value: '40'},
          {label: '合伙人', value: '30'},
          {label: '区长', value: '20'},
          {label: '团长', value: '10'},
          {label: '普通用户老用户', value: '5'},
          {label: '普通用户新用户', value: '6'}
        ]
      },
      activeNo: {
        type: 'input', label: '活动编号'
      },
      status: {
        type: 'select', label: '状态'
      },
      activityDescribe: {
        type: 'textarea', label: '活动说明'
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}
