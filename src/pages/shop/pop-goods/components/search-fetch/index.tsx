import React from 'react'
import { Select } from 'antd'
import { getPayload, setPayload } from '@/packages/common/utils'
import { SelectProps } from 'antd/es/select'
const { Option } = Select
import { debounce } from 'lodash'

interface Props {
  onChange?: (value: any) => void
  value?: any
  placeholder?: string,
  style?: React.CSSProperties
  api?: (value: string) => Promise<any>
  /** 保留搜索条件key值 */
  reserveKey?: string
  selectProps?: SelectProps
}

interface Option {
  value: string | number,
  text: string
}
interface State {
  data: Option[],
  value?: string
}
let currentValue: any
class Main extends React.Component<Props, State> {
  public state: State = {
    data: [],
    value: undefined
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      value: props.value
    })
  }
  public componentDidMount () {
    const { reserveKey } = this.props
    if (reserveKey) {
      this.setState({
        data: getPayload(reserveKey) || []
      })
    }
  }
  public handleSearch = (value: any) => {
    currentValue = value
    if (value) {
      const { api, reserveKey } = this.props
      if (api) {
        api(value).then((data) => {
          if (!Array.isArray(data)) {
            data = []
          }
          if (currentValue === value) {
            if (reserveKey) {
              setPayload(reserveKey, data)
            }
            this.setState({ data })
          }
        })
      }
    } else {
      this.setState({ data: [] })
    }
  }
  public debounceHandleSearch = debounce(this.handleSearch.bind(this), 500)
  public handleChange = (value: any) => {
    if (!this.props.value) {
      this.setState({ value })
    }
    const { onChange } = this.props
    if (typeof onChange === 'function') {
      onChange(value)
    }
  }
  public render () {
    const options = this.state.data.map((d) => <Option key={d.value}>{d.text}</Option>)
    return (
      <Select
        allowClear
        showSearch
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.debounceHandleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
        { ...this.props.selectProps }
      >
        {options}
      </Select>
    )
  }
}

export default Main