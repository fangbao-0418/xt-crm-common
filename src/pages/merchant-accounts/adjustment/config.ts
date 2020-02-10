import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      a: {
        type: 'number',
        label: '对账单ID'
      },
      b: {
        type: 'number',
        label: '对账单ID'
      },
      c: {
        type: 'select',
        label: '调整类型',
        options: [
          {label: '收入', value: 1},
          {label: '支出', value: 2}
        ]
      },
      d: {
        label: '状态',
        type: 'select',
        options: [
          {label: '代采购审核', value: 1},
          {label: '待财务审核', value: 2},
          {label: '审核通过', value: 3},
          {label: '审核不通过', value: 4},
        ]
      },
      e: {
        label: '调整原因',
        type: 'select',
        options: [
          {label: '订单补发', value: 1},
          {label: '运费补贴', value: 2},
          {label: '平台补贴', value: 3},
          {label: '售后扣款', value: 4},
          {label: '售后补偿', value: 5},
        ]
      },
      f: {
        type: 'input',
        label: '财务审核人'
      },
      a1: {
        type: 'rangepicker',
        label: '创建时间'
      },
      a2: {
        type: 'select',
        label: '创建人类型',
        options: [
          {label: '供应商', value: 1},
          {lable: '员工', value: 2}
        ]
      },
      a3: {
        type: 'input',
        label: '创建人类型'
      },
      memberId: {
        type: 'input',
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
      status: {
        type: 'select', label: '状态',
        fieldDecoratorOptions: {
          initialValue: 0
        },
        options: [
          {label: '黑名单主播', value: 1},
          {label: '正常', value: 0}
        ]
      },
      anchorIdentityType: {
        type: 'select', label: '主播身份',
        options: [
          {label: '供应商', value: 20},
          {label: '公司', value: 10},
          {label: '合作网红', value: 30},
          {label: '代理', value: 40}
        ],
        fieldDecoratorOptions: {
          rules: [
            {
              required: true,
              message: '请选择主播身份'
            }
          ]
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

export enum AnchorIdentityTypeEnum {
  供应商 = 20,
  公司 = 10,
  合作网红 = 30,
  代理 = 40
}

export enum AnchorLevelEnum {
  星级主播 = 10,
  普通主播 = 0
}