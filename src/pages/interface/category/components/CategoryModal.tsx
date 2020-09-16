import React from 'react'
import { Modal, Checkbox } from 'antd'
import { getPopList } from '../api'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
export interface CategoryModalProps {
  open(): void
}

interface Props {
  onOk(dataSource: any[]): void
}
interface State {
  visible: boolean
  dataSource: any[]
  checkedValue: CheckboxValueType[]
}
class Main extends React.Component<Props, State> {
  public state = {
    visible: false,
    dataSource: [],
    checkedValue: []
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData = async () => {
    const res = await getPopList()
    this.setState({
      dataSource: res
    })
  }
  public open = () => {
    this.setState({ visible: true })
  }
  public onCancel = () => {
    this.setState({ visible: false })
  }
  public onOk = () => {
    const checkedValue = this.state.checkedValue as any[]
    const dataSource = this.state.dataSource.filter((item: any) => {
      return checkedValue.includes(item.categoryId)
    })
    this.props.onOk(dataSource)
    this.onCancel()
  }
  public onChange = (checkedValue: CheckboxValueType[]) => {
    console.log('checkedValue', checkedValue)
    this.setState({ checkedValue })
  }
  public render () {
    const { visible, dataSource, checkedValue } = this.state
    return (
      <Modal
        title='选择类目'
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        <Checkbox.Group onChange={this.onChange} value={checkedValue}>
          {dataSource.map((item: any) => (
            <div>
              <Checkbox value={item.categoryId}>{item.categoryName}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>
      </Modal>
    )
  }
}

export default Main