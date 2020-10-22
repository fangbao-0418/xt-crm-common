import React from 'react'
import { Input, Select } from 'antd'

interface Props {
  value?: { type: 'id' | 'name', value: string }
  onChange?: (value: { type: string, value: string }) => void
}

interface State {
  placeholder: string
  value: any
  type: 'id' | 'name'
}

class Main extends React.Component<Props, State> {
  public state: State = {
    type: 'id',
    placeholder: '请输入供应商ID',
    value: ''
  }
  public componentWillReceiveProps (props: Props) {
    const value = props.value
    this.setState({
      type: value?.type || 'id',
      value: value?.value
    })
  }
  public render () {
    const { placeholder, value, type } = this.state
    return (
      <Input.Group compact>
        <Select
          defaultValue="id"
          value={type}
          style={{ minWidth: 80 }}
          onChange={(e: any) => {
            this.setState({
              type: e,
              value: '',
              placeholder: e === 'id' ? '请输入供应商ID' : '请输入供应商名称'
            })
          }}
        >
          <Select.Option value="id">ID</Select.Option>
          <Select.Option value="name">名称</Select.Option>
        </Select>
        <Input
          style={{ width: 200 }}
          value={value}
          onChange={(e: any) => {
            let value = e.target.value
            if (type === 'id') {
              if (!/^\d+$/.test(value)) {
                return
              }
            }
            this.setState({
              value: e.target.value
            })
            if (this.props.onChange) {
              this.props.onChange({
                type,
                value
              })
            }
          }}
          placeholder={placeholder}
        />
      </Input.Group>
    )
  }
}
export default Main
