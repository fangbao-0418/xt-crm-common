import React from 'react'
import { Cascader } from 'antd'
const { post } = APP.http
interface CategoryProps {
  childList: CategoryProps[]
  id: any
  name: string
}
interface State {
  options: any[]
  value: any[]
}
interface Props {
  placeholder?: string
  onChange?: (value?: any[], selectedOptions?: any[]) => void
  value?: any
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
  public componentWillReceiveProps (props: Props) {
    this.setState({
      value: props.value
    })
  }
  public componentWillMount () {
    this.fetchData()
  }
  public fetchData () {
    return post('/category/treeCategory').then((res: CategoryProps[]) => {
      this.setState({
        options: res
      })
    })
  }
  public onChange (value: any[], selectedOptions: any[]) {
    this.setState({
      value
    })
    if (this.props.onChange) {
      this.props.onChange(value, selectedOptions)
    }
  }
  public render () {
    const placeholder = this.props.placeholder || '请选择类目'
    return (
      <Cascader
        fieldNames={{label: 'name', value: 'id', children: 'childList'}}
        options={this.state.options}
        onChange={this.onChange}
        placeholder={placeholder}
        value={this.state.value}
      />
    )
  }
}
export default Main
