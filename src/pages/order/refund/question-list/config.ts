import _ from 'lodash'
import { OptionProps } from '@/packages/common/components/form'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export function getFieldsConfig (partial?: FieldsConfig): FieldsConfig {
  const defaultConfig: FieldsConfig = {
    common: {
      title: {
        type: 'input',
        label: '问题标题',
        controlProps: {
          placeholder: '请输入问题标题'
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '问题标题不能为空' },
            { max: 8, message: '问题内容最长8个字符' }
          ]
        }
      },
      fontSize: {
        type: 'input',
        label: '标题字号',
        controlProps: {
          placeholder: '请输入标题字号'
        },
        fieldDecoratorOptions: {
          rules: [
            { required: true, message: '标题字号不能为空' }
          ]
        }
      }
    }
  }
  return _.mergeWith(defaultConfig, partial)
}
