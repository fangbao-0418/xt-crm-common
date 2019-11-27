import React from 'react'
import { Modal } from 'antd'
import OrderMessage from './OrderMessage'
import PayMessage from './PayMessage'
interface State {
  visible: boolean,
  payload: any
}
function Main <T> (WrappedComponent: React.ComponentType<T>) {
  return class extends React.Component<T> {
    public state: State = {
      visible: false,
      payload: {}
    }
    public constructor (props: any) {
      super(props)
      this.handleOk = this.handleOk.bind(this)
      this.showModal = this.showModal.bind(this)
      this.hideModal = this.hideModal.bind(this)
    }
    public handleOk () {
      this.setState({
        visible: false
      })
    }
    public showModal (payload: any) {
      this.setState({
        payload,
        visible: true
      })
    }
    public hideModal () {
      this.setState({
        payload: {},
        visible: false
      })
    }
    public render () {
      const { payload: { type, title, ...rest } } = this.state
      return (
        <>
          <Modal
            width='700px'
            title={title}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
          >
            <OrderMessage hidden={type === 'orderMessage'} {...rest} />
            <PayMessage hidden={type === 'payMessage'} {...rest}/>
          </Modal>
          <WrappedComponent
            modal={{
              show: this.showModal
            }}
            {...this.props}
          />
        </>
      )
    }
  }
}

export default Main