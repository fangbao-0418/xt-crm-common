import { OptionProps } from '@/packages/common/components/form/index'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}

/** env环境发布配置 */
export const environmentTypeOptions: options[] = [
  { label: '草稿', value: '0' },
  { label: '本地环境', value: '1' },
  { label: '日常环境', value: '2' },
  { label: '测试环境1', value: '3' },
  { label: '测试环境2', value: '4' },
  { label: '预发环境', value: '5' },
  { label: '线上beta环境', value: '6' },
  { label: '线上环境', value: '7' },
  { label: '已下线', value: '8' }
]

export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    mySetting: {
      publishTime: {
        type: 'rangepicker',
        label: '发布时间',
        controlProps: {
          showTime: true
        },
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '发送时间不能为空'
            }
          ]
        }
      }
    }
  }
  return defaultConfig
}

// eslint-disable-next-line @typescript-eslint/tslint/config
export interface options {
  label: string;
  value: string;
}
/** 平台 */
export const platformCodesOptions: options[] = [
  { label: 'H5', value: '2' },
  { label: 'Android', value: '3' },
  { label: 'iOS', value: '4' },
  { label: '小程序', value: '5' }
]

/** 显示用户 */
export const memberTypesOptions: options[] = [
  { label: '未登录用户', value: '-1' },
  { label: '普通会员', value: '0' },
  { label: '团长', value: '10' },
  { label: '区长', value: '20' },
  { label: '合伙人', value: '30' }
]

/** 发布状态 */
export enum statusEnums {
  '草稿' = 0,
  '已发布' = 1,
  '已下线' = 2
}

/** 发布状态对应颜色值 */
export enum colorEnums {
  'gray' = 0,
  'blue' = 1,
  'orange' = 2
}
