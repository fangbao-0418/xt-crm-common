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
        type: 'rangepicker', label: '活动时间',
        controlProps: {
          showTime: true
        }
      },
      createTime: {
        type: 'rangepicker', label: '创建时间',
        controlProps: {
          showTime: true
        }
      },
      title: {
        type: 'input', label: '活动名称',
        fieldDecoratorOptions: {
          rules: [
            {
              // min: 1,
              required: true,
              message: '活动名称不能为空'
            },
            {
              // min: 1,
              max: 20,
              message: '最多20个字符'
            }
          ]
        }
      },
      /** 活动类型 */
      type: {
        type: 'select', label: '活动类型',
        options: [
          {label: '限时秒杀', value: '1'},
          {label: '今日拼团', value: '2'},
          {label: '礼包', value: '3'},
          {label: '激活码', value: '4'},
          {label: '地推专区', value: '5'},
          {label: '体验团长专区', value: '6'},
          {label: '采购专区', value: '7'}
        ],
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
        type: 'rangepicker', label: '活动时间'
      },
      userScope: {
        type: 'checkbox', label: '目标用户',
        options: [
          {label: '全部', value: 'all'},
          {label: '管理员', value: '40'},
          {label: '合伙人', value: '30'},
          {label: '区长', value: '20'},
          {label: '团长', value: '10'},
          {label: '普通用户老用户', value: '2'},
          {label: '普通用户新用户', value: '1'}
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择目标用户'
            }
          ]
        }
      },
      id: {
        type: 'input', label: '活动编号'
      },
      status: {
        type: 'select', label: '状态',
        options: [
          {label: '未开始', value: '1'},
          {label: '进行中', value: '2'},
          {label: '已结束', value: '3'},
          {label: '已关闭', value: '0'},
        ]
      },
      activityDescribe: {
        type: 'textarea', label: '活动说明',
        fieldDecoratorOptions: {
          rules: [
            {
              max: 140,
              message: '活动说明，最多140个字符'
            }
          ]
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}
