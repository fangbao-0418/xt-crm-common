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
        type: 'input',
        label: '对账单名称 '
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
      a4: {
        type: 'rangepicker', label: '创建时间',
        controlProps: {
          showTime: true
        }
      },
      a5: {
        type: 'number', label: '调整金额',
        controlProps: {
          style: {width: '100%'}
        }
      },
      a6: {
        type: 'textarea', label: '调整说明'
      },
      a11: {
        type: 'radio', label: '审核意见',
        fieldDecoratorOptions: {
          initialValue: 1
        },
        options: [
          {label: '审核通过', value: 1},
          {label: '审核不通过', value: 2},
        ]
      },
      a12: {
        type: 'textarea', label: '审核说明'
      },
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