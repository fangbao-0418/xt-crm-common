import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      liveTitle: {
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
      planId: {
        type: 'input', label: '房间ID',
        fieldDecoratorOptions: {
          rules: [
            {
              pattern: /^\d+$/,
              message: '格式不正确'
            }
          ]
        }
      },
      anchorId: {
        type: 'number', label: '主播ID',
        controlProps: {
          style: {
            width: 150
          },
          placeholder: '主播ID'
        }
      },
      nickName: {
        type: 'input', label: '主播昵称',
        controlProps: {
          placeholder: '主播昵称'
        }
      },
      liveStatus: {
        type: 'select', label: '直播状态',
        options: [
          {label: '直播中', value: 90},
          {label: '待审核', value: 10},
          {label: '已结束', value: 60},
          {label: '待开播', value: 70},
          {label: '已过期', value: 30},
          {label: '禁播', value: 40},
          {label: '未过审', value: 20}
        ]
      },
      liveTime: {
        type: 'rangepicker', label: '开播时间',
        controlProps: {
          showTime: true
        }
      },
      anchorLevel: {
        type: 'select', label: '主播等级',
        options: [
          {label: '星级主播', value: 10},
          {label: '普通主播', value: 0}
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择主播等级'
            }
          ]
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

/** 直播类型 */
export enum TypeEnum {
  公开直播 = 0,
  私密直播 = 10
}