import React from 'react'
import CouponModal from '@/components/coupon-modal'
interface State {
  visible: boolean,
  selectedRowKeys: any[]
}

export interface Payload {
  success?: any
}
export interface ModalProps {
  show(payload: Payload): void
  hide: () => void
}

function Main (WrappedComponent: React.ComponentType<any>) {
  return class extends React.Component<any, State> {
    public state: State = {
      visible: false,
      selectedRowKeys: []
    }
    public payload: Payload = {
      success: () => {}
    }
    public modal: ModalProps = {
      show: (payload) => {
        this.payload = payload
        this.setState({ visible: true })
      },
      hide: () => {
        this.setState({ visible: false })
      }
    }
    public render () {
      const { visible, selectedRowKeys } = this.state
      return (
        <>
          <CouponModal
            selectedRowKeys={selectedRowKeys}
            type='checkbox'
            processPayload={(payload: any) => {
              payload.isDelete = undefined
              payload.receivePattern = undefined
              return payload
            }}
            maxCheckedNum={3}
            visible={visible}
            onCancel={this.modal.hide}
            onOk={(ids, rows) => {
              this.setState({
                selectedRowKeys: ids
              }, this.payload.success.bind(null, rows, this.modal.hide))
            }}
          />
          <WrappedComponent modal={this.modal} {...this.props}/>
        </>
      )
    }
  }
}
export default Main