import React from 'react'
import { AutoComplete } from 'antd'
import { queryFloor } from '../content/api'
import { AutoCompleteProps, DataSourceItemType } from 'antd/lib/auto-complete'

interface Props {
  controlProps: AutoCompleteProps
  value?: any,
  onChange?: (res: any) => void
}
interface State {
  dataSource?: DataSourceItemType[]
}
class Main extends React.Component<Props, State> {
  public state: State = {
    dataSource: []
  }
  public componentDidMount () {
    this.fetchDetail()
  }
  /** 查询楼层 */
  public async fetchDetail () {
    const res = await queryFloor({
      page: 1,
      pageSize: 10000
    })
    const dataSource: DataSourceItemType[] = res.records
      .map((v: any) => ({
        text: v.floorName,
        value: v.id && String(v.id)
      }))
    this.setState({
      dataSource
    })
  }

  public render () {
    const { controlProps, value, onChange } = this.props
    console.log('floorId => ', value)
    const { dataSource } = this.state
    return (
      <AutoComplete
        {...controlProps}
        dataSource={dataSource}
        value={value && String(value)}
        onChange={onChange}
      />
    )
  }  
}

export default Main