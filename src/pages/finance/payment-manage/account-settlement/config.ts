import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      id: {
        type: 'input',
        label: '账务结算ID',
        controlProps: {
          placeholder: '请输入账务结算ID'
        }
      },
      subjectId: {
        label: '账务对象ID',
        type: 'input',
        controlProps: {
          placeholder: '请输入账务对象ID'
        }
      },
      subjectName: {
        label: '账务结算对象名称',
        type: 'input',
        controlProps: {
          placeholder: '请输入账务结算对象名称'
        }
      },
      auditStatus: {
        type: 'select',
        label: '审核状态',
        fieldDecoratorOptions: {
          initialValue: 0
        },
        options: [
          { label: '待审核', value: 1 },
          { label: '审核通过', value: 0 },
          { label: '审核不通过', value: 0 }
        ]
      },
      inOrOutType: {
        type: 'select',
        label: '收支类型',
        fieldDecoratorOptions: {
          initialValue: 0
        },
        options: [
          { label: '收入', value: 1 },
          { label: '支出', value: 0 }
        ]
      },
      settlementStatus: {
        type: 'select',
        label: '结算状态',
        fieldDecoratorOptions: {
          initialValue: 0
        },
        options: [
          { label: '待结算', value: 1 },
          { label: '已结算', value: 0 }
        ]
      },
      time: {
        label: '创建时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      },
      settlementType: {
        type: 'select',
        label: '创建方式',
        fieldDecoratorOptions: {
          initialValue: 0
        },
        options: [
          { label: '系统创建', value: 1 },
          { label: '人工创建', value: 0 }
        ]
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