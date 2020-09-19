import React from 'react'
import { Cascader } from 'antd'
import * as api from './api'
interface ItemProps {
  children: ItemProps[]
  key: any
  value: string
}
//bizSource:0为喜团优选，10为喜团买菜，20为喜团好店
interface Props {
  value?: any[]
  onChange?: (value?: any[]) => void
  bizSource?: number
}
interface State {
  options: ItemProps[]
}
class Main extends React.Component<Props> {
  public state: State = {
    options: []
  };
  public componentDidMount () {
    this.fetchData(this.props.bizSource)
  }
  // 喜团优选需要请求category接口，好店不需要
  public fetchData (bizSource?: number) {
    api.getSeatList(bizSource).then((res: ItemProps[]) => {
      if (bizSource === 20) {
        this.setState({ options: res })
      } else {
        this.fetchCategory(res)
      }
    })
  }
  public componentWillReceiveProps(nextProps: any) {
    if (this.props.bizSource !== nextProps.bizSource) {
      this.fetchData(nextProps.bizSource)
    }
  }
  public fetchCategory (options: ItemProps[]) {
    api.getCategory().then((res: any) => {
      if (res.records) {
        if (options[1]) {
          options[1].children = res.records.map((item: {id: any, name: string}) => {
            return {
              key: item.id,
              value: item.name
            }
          })
        }
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
        fieldNames={{ label: 'value', value: 'key', children: 'children' }}
        onChange={this.onChange}
        value={this.props.value}
        changeOnSelect
      />
    )
  }
}
export default Main