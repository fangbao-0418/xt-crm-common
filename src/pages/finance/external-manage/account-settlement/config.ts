import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      id: {
        label: '账务结算ID',
        type: 'input',
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
      inOrOutType: {
        type: 'select',
        label: '收支类型',
        options: [
          { label: '收入', value: 1 },
          { label: '支出', value: 2 }
        ],
        controlProps: {
          placeholder: '请选择收支类型'
        }
      },
      processStatus: {
        type: 'select',
        label: '处理状态',
        options: [
          { label: '记账失败', value: -1 },
          { label: '待记账', value: 0 },
          { label: '记账成功', value: 1 }
        ],
        controlProps: {
          placeholder: '请选择处理状态'
        }
      },
      createTime: {
        label: '创建时间',
        type: 'rangepicker',
        controlProps: {
          showTime: true
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}
