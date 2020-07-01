import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      liveTitle: {
        type: 'input',
        label: '直播标题',
        fieldDecoratorOptions: {
          rules: [
            {
              pattern: /^\d{11}$/,
              message: '格式不正确'
            }
          ]
        }
      },
      phone: {
        type: 'input', label: '手机号码'
      },
      anchorPhone: {
        type: 'input', label: '手机号码'
      },
      planId: {
        type: 'number',
        label: '房间ID',
        controlProps: {
          style: {
            width: 150
          },
          placeholder: '房间ID'
        },
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
        type: 'number',
        label: '主播ID',
        controlProps: {
          style: {
            width: 150
          },
          placeholder: '主播ID'
        }
      },
      anchorNickName: {
        type: 'input',
        label: '主播昵称',
        controlProps: {
          placeholder: '主播昵称'
        }
      },
      liveTop: {
        type: 'select',
        label: '是否置顶',
        options: [
          // {label: '官方置顶', value: 2},
          { label: '置顶', value: 1 },
          { label: '未置顶', value: 0 }
        ]
      },
      liveStatus: {
        type: 'select',
        label: '直播状态',
        options: [
          { label: '直播中', value: 90 },
          { label: '即将开始', value: 80 },
          { label: '待审核', value: 10 },
          { label: '已结束', value: 60 },
          { label: '待开播', value: 70 },
          { label: '已过期', value: 30 },
          { label: '预告禁播', value: 40 },
          { label: '运营停播', value: 50 },
          { label: '未过审', value: 20 }
        ]
      },
      liveTime: {
        type: 'rangepicker',
        label: '开播时间',
        controlProps: {
          showTime: true
        }
      },
      type: {
        type: 'select',
        label: '直播类型',
        options: [
          { label: '公开直播', value: 0 },
          { label: '私密直播', value: 10 }
        ]
      },
      anchorLevel: {
        type: 'select',
        label: '主播等级',
        options: [
          { label: '星级主播', value: 10 },
          { label: '普通主播', value: 0 }
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
  '回放已停播' = 51,
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

/** 直播等级 */
export enum LevelEnum {
  普通主播 = 0,
  星级主播 = 10
}

/** 举报类型 */
export enum ComplainTypeEnum {
  讨论政治内容 = 0,
  暴力恐怖血腥 = 10,
  '色情,低俗' = 20,
  赌博诈骗 = 30,
  长时间无人直播 = 40,
  '头像,封面内容侵权' = 50,
  其他违规 = 60
}

/** 优惠券状态 */
export enum CouponStatsEnum {
  未开始 = 0,
  进行中 = 1,
  已结束 = 2
}