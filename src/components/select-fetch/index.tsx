import React from 'react'
import { Select } from 'antd'

interface Props {
  fetchData: () => Promise<{label: string, value: any}[]>
  style?: React.CSSProperties
  onChange?: (value: any) => void
  placeholder?: string
  value?: any
}
interface State {
  options: {label: string, value: any}[]
  value: any
}
class Main extends React.Component<Props> {
  public state: State = {
    options: [],
    value: this.props.value
  }
  public constructor (props: Props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }
  public componentDidMount () {
    this.fetchData()
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      value: props.value
    })
  }
  public fetchData () {
    const fetchData = this.props.fetchData
    if (fetchData) {
      fetchData().then((res: any) => {
        this.setState({
          options: res
        })
      })
    }
  }
  onChange (value: any) {
    console.log(value, 'value')
    this.setState({
      value
    })
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }
  public render () {
    const { options, value } = this.state
    return (
      <Select
        value={value}
        placeholder={this.props.placeholder || '请选择'}
        style={this.props.style}
        onChange={this.onChange}
      >
        {options.map((item, index) => {
          return (
            <Select.Option
              key={index}
              value={item.value}
            >
              {item.label}
            </Select.Option>
          )
        })}
      </Select>
    )
  }
}
export default Main
