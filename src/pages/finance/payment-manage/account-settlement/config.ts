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
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '账务对象ID必填' }
          ]
        }
      },
      subjectName: {
        label: '账务结算对象名称',
        type: 'input',
        controlProps: {
          placeholder: '请输入账务结算对象名称'
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '请校验账务对象ID' }
          ]
        }
      },
      auditStatus: {
        type: 'select',
        label: '审核状态',
        options: [
          { label: '待审核', value: 0 },
          { label: '审核通过', value: 1 },
          { label: '审核不通过', value: 2 }
        ]
      },
      inOrOutType: {
        type: 'select',
        label: '收支类型',
        options: [
          { label: '收入', value: 1 },
          { label: '支出', value: 2 }
        ]
      },
      settlementStatus: {
        type: 'select',
        label: '结算状态',
        options: [
          { label: '待结算', value: 0 },
          { label: '冻结中', value: -1 },
          { label: '已结算', value: 2 },
          { label: '结算关闭', value: -2 }
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
        options: [
          { label: '系统创建', value: 2 },
          { label: '人工创建', value: 1 }
        ]
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}