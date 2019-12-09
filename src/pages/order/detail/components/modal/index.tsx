import React from 'react'
import { Modal } from 'antd'
import OrderMessage from './OrderMessage'
import PayMessage from './PayMessage'
import { namespace } from '../../model'
import { withRouter, RouteComponentProps } from 'react-router'
interface State {
  visible: boolean,
  payload: any
}
function Main (WrappedComponent: React.ComponentType<any>) {
  class Comp extends React.Component<RouteComponentProps<{id: any}>> {
    public state: State = {
      visible: false,
      payload: {}
    }
    public constructor (props: any) {
      super(props)
      this.handleOk = this.handleOk.bind(this)
      this.showModal = this.showModal.bind(this)
      this.hideModal = this.hideModal.bind(this)
      this.onOk = this.onOk.bind(this)
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
    public onOk () {
      this.hideModal()
      APP.dispatch({
        type: `${namespace}/fetchDetail`,
        payload: {
          orderCode: this.props.match.params.id
        }
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
            onCancel={this.hideModal}
            footer={null}
          >
            {type === 'orderMessage' && <OrderMessage hideModal={this.hideModal} {...rest} onOk={this.onOk}/>}
            {type === 'payMessage' && <PayMessage hideModal={this.hideModal} {...rest} onOk={this.onOk}/>}
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
  return withRouter(Comp)
}

export default Main