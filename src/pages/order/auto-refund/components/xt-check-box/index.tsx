import React from 'react'
import { Checkbox } from 'antd'

const CheckboxGroup = Checkbox.Group

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' }
]

const plainOptions = ['Apple', 'Pear', 'Orange']

class XtCheckBox extends React.Component {
  state = {
    value: [],
    indeterminate: true,
    checkAll: false
  }

  handleChange = (value: any) => {
    this.setState({
      value,
      indeterminate: !!value.length && value.length < plainOptions.length,
      checkAll: value.length === plainOptions.length
    })
  }

  handleCheckAllChange = (e: any) => {
    this.setState({
      value: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked
    })
  }

  render () {
    const { value, indeterminate, checkAll } = this.state

    return (
      <div>
        <Checkbox
          indeterminate={indeterminate}
          onChange={this.handleCheckAllChange}
          checked={checkAll}
        >
          Check all
        </Checkbox>
        <CheckboxGroup
          options={plainOptions}
          value={value}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

export default XtCheckBox