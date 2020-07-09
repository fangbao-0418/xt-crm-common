import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      mainProblemName: {
        type: 'input',
        label: '配置标题',
        controlProps: {
          placeholder: '最多可输入6字'
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '配置标题能为空' },
            { max: 6, message: '配置标题最长6个字符' }
          ]
        }
      },
      mainProblemSort: {
        type: 'number',
        label: '排序号',
        controlProps: {
          style: { width: '100%' },
          placeholder: '请输入排序号'
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}