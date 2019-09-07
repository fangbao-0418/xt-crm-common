import React from 'react'
import { Cascader } from 'antd'
import * as api from './api'
interface ItemProps {
  children: ItemProps[]
  key: any
  value: string
}
interface Props {
  value?: any[]
  onChange?: (value?: any[]) => void
}
interface State {
  options: ItemProps[]
}
class Main extends React.Component<Props> {
  public state: State = {
    options: []
  };
  public componentDidMount () {
    api.getSeatList().then((res: ItemProps[]) => {
      this.fetchCategory(res)
    })
  }
  public fetchCategory (options: ItemProps[]) {
    api.getCategory().then((res: any) => {
      if (res.records) {
        options[1].children = res.records.map((item: {id: any, name: string}) => {
          return {
            key: item.id,
            value: item.name
          }
        })
        this.setState({
          options
        })
      }
    })
  }
  public onChange = (value: any[], selectedOptions: any) => {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  };
  public render () {
    return (
      <Cascader
        placeholder='请选择位置'
        options={this.state.options}
        fieldNames={{label: 'value', value: 'key', children: 'children'}}
        onChange={this.onChange}
        value={this.props.value}
        changeOnSelect
      />
    )
  }
}
export default Main