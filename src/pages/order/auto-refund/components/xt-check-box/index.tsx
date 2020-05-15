import React from 'react'
import { Checkbox } from 'antd'
import { CheckboxGroupProps } from 'antd/lib/checkbox'

const CheckboxGroup = Checkbox.Group

class XtCheckBox extends React.Component<CheckboxGroupProps> {
  state = {
    value: [],
    indeterminate: !!this.props.value?.length && this.props.value.length < (this.props.options as Array<any>)?.length,
    checkAll: this.props.value?.length === this.props.options?.length
  }

  static getDerivedStateFromProps (nextProps: CheckboxGroupProps) {
    if (nextProps.value && nextProps.options && nextProps.options.length) {
      const value = nextProps.value
      console.log(111)
      return {
        value,
        indeterminate: !!value.length && value.length < nextProps.options.length,
        checkAll: value.length === nextProps.options.length
      }
    }
    return null
  }

  handleChange = (value: any) => {
    const { options = [], onChange } = this.props
    this.setState({
      value,
      indeterminate: !!value.length && value.length < options.length,
      checkAll: value.length === options.length
    }, () => {
      if (onChange) {
        onChange(value)
      }
    })
  }

  handleCheckAllChange = (e: any) => {
    const { options = [], onChange } = this.props
    const value = e.target.checked ? options.map((item: any) => item.value) : []
    this.setState({
      value,
      indeterminate: false,
      checkAll: e.target.checked
    }, () => {
      if (onChange) {
        onChange(value)
      }
    })
  }

  render () {
    const { options } = this.props
    const { value, indeterminate, checkAll } = this.state

    return (
      <div>
        <Checkbox
          indeterminate={indeterminate}
          onChange={this.handleCheckAllChange}
          checked={checkAll}
        >
          全部
        </Checkbox>
        <CheckboxGroup
          options={options}
          value={value}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

export default XtCheckBox