import React from 'react'
import { Modal } from 'antd'
import ListPage from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/lib/table'
import { getProductList } from './api'
interface State {
  visible: boolean
}
class Main extends React.Component<{}, State> {
  public state = {
    visible: false
  }
  public columns: ColumnProps<any>[] = []
  public open = () => {
    this.setState({ visible: true })
  }
  public onOk = () => {}
  public onCancel = () => {
    this.setState({
      visible: false
    })
  }
  public render () {
    const { visible } = this.state
    return (
      <Modal
        title='选择商品'
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <ListPage columns={this.columns} />
      </Modal>
    )
  }
}

export default Main