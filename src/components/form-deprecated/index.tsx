import React from 'react'
import { Form } from 'antd'
import classNames from 'classnames'
import { FormComponentProps, FormItemProps as SourceFormItemProps } from 'antd/lib/form'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form'
import moment from 'moment'
import styles from './style/index.module.sass'
import FormItem from './FormItem'
import FormContext from './Context'
export { default as FormItem }from './FormItem'
export { getFieldsConfig } from './config'
import { getFieldsConfig } from './config'
export interface FieldsConfig {
  [namespace: string]: {[field: string]: OptionProps}
}
export type FormTypePops = '' | 'input' | 'text' | 'rangepicker' | 'select' | 'radio' | 'checkbox' | 'date' | 'textarea'
interface ControlProps {
  className?: string
  style?: React.CSSProperties
  placeholder?: string | string[]
  [props: string]: any
}
export interface FormItemProps extends SourceFormItemProps {
  addonAfterCol?: ColProps
}
export interface OptionProps {
  className?: string
  style?: React.CSSProperties
  field?: string
  type?: FormTypePops
  label?: React.ReactNode
  options?: any[]
  /** option数据字段转换 */
  optionFieldexchange?: {label: string, value: string}
  /** 控件原属性 */
  controlProps?: ControlProps
  fieldDecoratorOptions?: GetFieldDecoratorOptions
  /** FormItem 属性 */
  formItemProps?: FormItemProps
}
interface ColProps {span?: number, offset?: number}

export type NamespaceProps = 'common' | 'marketing'

export interface Props extends FormComponentProps {
  config?: FieldsConfig
  disabled?: boolean
  readonly?: boolean
  size?: 'small' | 'middle'
  layout?: 'inline' | 'horizontal' | 'vertical'
  onChange?: (field?: string, value?: any, values?: any) => void
  getInstance?: (ref: Main) => void
  wrapperCol?: ColProps
  labelCol?: ColProps
  addonAfterCol?: ColProps
  className?: string
  style?: React.CSSProperties
  namespace?: NamespaceProps
  /** 范围字段映射 */
  rangeMap?: {[field: string]: {fields: string[], format?: string}}
}
/** form 实例 */
export interface FormInstance {
  setValues: <T = any> (values: T) => void
  getValues: <T = any> () => T
  props: Props
}

const defaultRangeMap = {
  orderTime: {
    fields: ['orderStartTime', 'orderEndTime'],
    format: 'YYYY-MM-DD HH:mm:ss'
  },
  deliverTime: {
    fields: ['deliverStartTime', 'deliverEndTime'],
    format: 'YYYY-MM-DD HH:mm:ss'
  },
  createTime: {
    fields: ['createTimeBegin', 'createTimeEnd'],
    format: 'YYYY-MM-DD HH:mm:ss'
  }
}

function handleValues <T = any> (rangeMap: {[field: string]: {fields: string[], format?: string}}, rawValues: any): T {
  for (const field in rangeMap) {
    if (field in rangeMap) {
      const rangeFields = rangeMap[field]
      const rangeValue: any[] = rawValues[field] || []
      rangeFields.fields.map((rangeField, index) => {
        rawValues[rangeField] = rangeValue[index] && rangeValue[index].format && (
          rangeFields.format ? rangeValue[index].format(rangeFields.format) : rangeValue[index].unix()
        )
      })
      if (rangeFields.fields.indexOf(field) === -1) {
        delete rawValues[field]
      }
    }
  }
  return rawValues
}

class Main extends React.Component<Props> {
  public static create = Form.create
  public componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
    }
  }
  public setValues (values: {[field: string]: any}) {
    const rangeMap = this.props.rangeMap || defaultRangeMap
    for (const field in rangeMap) {
      if (field in rangeMap) {
        const rangeFields = rangeMap[field]
        const rangeValue: any[] = []
        /** 是否存在日期字段 */
        let isExistField = false
        rangeFields.fields.map((rangeField) => {
          rangeValue.push(
            values[rangeField] && moment(values[rangeField])
          )
          if (values.hasOwnProperty(rangeField)) {
            isExistField = true
            delete values[rangeField]
          }
        })
        if (isExistField) {
          values[field] = rangeValue 
        }
      }
    }
    /** 过滤掉未注册form数据 */
    const rawValues = this.props.form.getFieldsValue()
    const result: any = {}
    for (const key in rawValues) {
      if (rawValues.hasOwnProperty(key) && values.hasOwnProperty(key)) {
        result[key] = values[key]
      }
    }
    this.props.form.setFieldsValue(result)
  }
  public getValues <T = any> (): T {
    const rawValues: any = this.props.form.getFieldsValue()
    const rangeMap = this.props.rangeMap || defaultRangeMap
    return {
      ...handleValues<T>(rangeMap, rawValues)
    }
  }
  public renderItems () {
    const nodes: React.ReactNode[] = []
    const config = this.props.config || getFieldsConfig()
    for (const namespace in config) {
      if (namespace in config) {
        const fields = config[namespace]
        for (const field in fields) {
          if (field in fields) {
            const item = fields[field]
            const node = (
              <FormItem
                name={item.field}
                {...item}
              />
            )
            nodes.push(node)
          }
        }
      }
    }
    return nodes
  }
  public render () {
    const layout = this.props.layout || 'horizontal'
    const { className, style } = this.props
    const size = this.props.size || 'middle'
    return (
      <Form
        layout={layout}
        style={style}
        className={classNames(styles.form, className, styles[`form-${layout}`], styles[`form-${size}`])}
        labelCol={this.props.labelCol}
        wrapperCol={this.props.wrapperCol}
      >
        <FormContext.Provider
          value={{
            props: this.props
          }}
        >
          {this.props.children ? this.props.children : this.renderItems()}
        </FormContext.Provider>
      </Form>
    )
  }
}
export default Form.create<Props>({
  onValuesChange: (props, changedFields, allFields) => {
    const field = Object.keys(changedFields)[0]
    if (props.onChange) {
      const rangeMap = props.rangeMap || defaultRangeMap
      props.onChange(field, changedFields[field], handleValues(rangeMap, allFields))
    }
  }
})(Main)
