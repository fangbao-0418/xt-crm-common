import React, { useContext, useMemo } from 'react'
import {
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Radio,
  Checkbox
} from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import _ from 'lodash'
import classNames from 'classnames'
import {
  OptionProps,
  getFieldsConfig,
  FormItemProps,
  FormInstance
} from './index'
import FormContext, { ContextProps } from './Context'
import styles from './style/index.module.sass'

const Item = Form.Item

interface Props extends OptionProps, FormItemProps {
  hidden?: boolean
  name?: string
  namespace?: string
  className?: string
  style?: React.CSSProperties
  /** 设置后置标签 */
  addonAfter?: React.ReactNode
  children?: React.ReactNode
  inner?: (form?: WrappedFormUtils) => React.ReactNode
  placeholder?: string | string[]
  /** 控件是否校验 默认false，不进行校验 */
  verifiable?: boolean
  disabled?: boolean
}

const ReadOnlyValue = React.forwardRef((props: React.Props<{}>, ref: any) => {
  return (
    <span ref={ref}>{props.children}</span>
  )
})

function renderItem (option: Props, context: ContextProps) {
  const form = context.props.form
  const disabled = option.disabled || context.props.disabled
  const {
    name,
    type,
    controlProps,
    options = []
  } = option
  let node: React.ReactNode
  switch (type) {
  case 'input':
    node = (() => {
      controlProps.placeholder = controlProps.placeholder as string
      let placeholder = controlProps.placeholder === undefined ? `请输入${option.label}` : controlProps.placeholder
      let value = form.getFieldValue(name)
      return !disabled ? (
        <Input
          {...controlProps}
          placeholder={placeholder}
        />
      ) : <ReadOnlyValue>{value}</ReadOnlyValue>
    })()
    break
  case 'textarea':
    node = (() => {
      let placeholder = controlProps.placeholder as string || `请输入${option.label}`
      let value = form.getFieldValue(name)
      return !disabled ? (
        <Input.TextArea
          {...controlProps}
          placeholder={placeholder}
        />
      ) : <ReadOnlyValue>{value}</ReadOnlyValue>
    })()
    break
  case 'radio':
    node = (() => {
      return (
        <Radio.Group
          disabled={disabled}
          {...controlProps}
        >
          {options.map((item, index) => {
            return (
              <Radio
                key={index}
                value={item.value}
              >
                {item.label}
              </Radio>
            )
          })}
        </Radio.Group>
      )
    })()
    break
  case 'checkbox':
    node = (() => {
      return (
        <Checkbox.Group
          disabled={disabled}
          {...controlProps}
          options={options}
        >
        </Checkbox.Group>
      )
    })()
    break
  case 'text':
    node = (
      <span className={styles['form-item-text']}>
        {form.getFieldValue(name)}
      </span>
    )
    break
  case 'select':
    node = (() => {
      const placeholder = controlProps.placeholder as string || `请选择${option.label}`
      return (
        <Select
          {...controlProps}
          placeholder={placeholder}
          allowClear
          disabled={disabled}
        >
          {
            options.map((item, index) => {
              return (
                <Select.Option
                  key={index}
                  value={item.value}
                >
                  {item.label}
                </Select.Option>
              )
            })
          }
        </Select>
      )
    })()
    break
  case 'date':
    node = (() => {
      const placeholder = controlProps.placeholder as string || `请选择日期`
      return (
        <DatePicker
          disabled={disabled}
          {...controlProps}
          placeholder={placeholder}
        />
      )
    })()
    break
  case 'rangepicker':
    node = (() => {
      const placeholder = controlProps.placeholder as string[] || [`请选择开始时间`, `请选择结束时间`]
      const value: any[] = form.getFieldValue(name) instanceof Array && form.getFieldValue(name) || []
      return (
        <span
          className={styles['range-picker']}
        >
          <DatePicker
            disabled={disabled}
            showToday={false}
            {...controlProps}
            placeholder={placeholder[0]}
            value={value[0]}
            disabledDate={(currentDate) => {
              return value[1] && currentDate > value[1]
            }}
            onChange={(date, dateString) => {
              value[0] = date
              form.setFieldsValue({
                [name]: value[0] || value[1] ? value : undefined
              })
            }}
          />
          <span className={styles['range-picker-separator']}>-</span>
          <DatePicker
            disabled={disabled}
            showToday={false}
            {...controlProps}
            placeholder={placeholder[1]}
            value={value[1]}
            disabledDate={(currentDate) => {
              return value[0] && currentDate < value[0]
            }}
            onChange={(date, dateString) => {
              value[1] = date
              form.setFieldsValue({
                [name]: value[0] || value[1] ? value : undefined
              })
            }}
          />
        </span>
      )
    })()
    break
  }
  return node
}

function Main (props: Props) {
  const context = useContext(FormContext)
  const { name, addonAfter, className, style } = props
  const namespace = props.namespace || context.props.namespace || 'common'
  const form = context.props.form
  const config = context.props.config || getFieldsConfig()
  const layout = context.props.layout || 'horizontal'
  const option = useMemo(() => {
    const data = _.mergeWith(
      {
        optionFieldexchange: { label: 'label', value: 'value' },
        controlProps: {},
        formItemProps: {},
        fieldDecoratorOptions: { rules: [] }
      },
      config[namespace] && config[namespace][name],
      props
    ) as Props
    data.options = props.options && props.options.length > 0 ? props.options : data.options
    const optionFieldexchange = data.optionFieldexchange
    if (data.options instanceof Array) {
      data.options = data.options.map((item) => {
        return {
          ...item,
          label: item[optionFieldexchange.label],
          value: item[optionFieldexchange.value]
        }
      })
    }
    data.type = data.name && (data.type || 'input')
    const verifiable = props.verifiable || false
    data.fieldDecoratorOptions.rules = verifiable ? data.fieldDecoratorOptions.rules : []
    data.controlProps = Object.assign({}, data.controlProps, {
      placeholder:  data.placeholder
    })
    data.formItemProps = Object.assign({}, data.formItemProps, {
      labelCol:  data.labelCol || data.formItemProps.labelCol || context.props.labelCol,
      wrapperCol: data.wrapperCol || data.formItemProps.wrapperCol || context.props.wrapperCol,
      addonAfterCol: data.addonAfterCol || data.formItemProps.addonAfterCol || context.props.addonAfterCol,
      colon: !(data.name || data.label) ? false : (props.colon !== undefined ? props.colon : true),
      required: data.required || data.fieldDecoratorOptions.rules.length > 0
    })
    if (layout === 'horizontal' && !data.formItemProps.labelCol) {
      data.formItemProps.labelCol = {span: 4}
      data.formItemProps.wrapperCol = {span: 20}
    }
    return data
  }, [props, context.props.config, context.props.namespace])
  const {
    type,
    label,
    formItemProps,
    fieldDecoratorOptions
  } = option
  const { required, labelCol, wrapperCol, addonAfterCol, colon } = formItemProps
  const children = props.children || props.inner && props.inner(form) || renderItem(option, context)
  const hidden = props.hidden || false

  return (
    <div
      hidden={hidden}
      style={style}
      className={classNames(className, styles['form-item'])}
    >
      <Row>
        <Col
          {...labelCol}
          className={styles['form-item-label']}
        >
          <label
            className={classNames({
              [styles['form-item-label-required']]: required,
              [styles['form-item-no-colon']]: !colon
            })}
            htmlFor={name}
          >
            {label}
          </label>
        </Col>
        { children && (
          <Col
            {...wrapperCol}
            className={styles['form-item-control-wrapper']}
          >
            <Item
              {...formItemProps}
              wrapperCol={{span: 24}}
            >
              {
                name ? (type === 'text' ? children : form.getFieldDecorator(
                  name,
                  {
                    ...fieldDecoratorOptions
                  }
                )(
                  children
                )) : children
              }
            </Item>
            <Item
              style={{display: 'none'}}
            >
              {
                type === 'text' && form.getFieldDecorator(
                  name
                )(
                  <Input />
                )
              }
            </Item>
          </Col>
        )}
        { addonAfter && (
          <Col {...addonAfterCol} className={styles['form-item-addon-after']}>
            {addonAfter}
          </Col>
        )}
      </Row>
    </div>
  )
}
export default Main
