import React from 'react'
import { Modal } from 'antd'

export interface CategoryModalProps {
  open(): void
}
interface State {
  visible: boolean
}
class Main extends React.Component<{}, State> {
  public state = {
    visible: false
  }
  public open = () => {
    this.setState({ visible: true })
  }
  public onCancel = () => {
    this.setState({ visible: false })
  }
  public onOk = () => {

  }
  public render () {
    const { visible } = this.state
    return (
      <Modal
        title='选择类目'
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >

      </Modal>
    )
  }
}

export default Main