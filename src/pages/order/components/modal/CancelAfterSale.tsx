import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { namespace } from '../../refund/model';
import { FormComponentProps } from 'antd/es/form';
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  cancel: boolean,
  style: any
}
interface State {
  visible: boolean
}
const { TextArea } = Input;
class CancelAfterSale extends React.Component<Props, State> {
  state: State = {
    visible: false
  }
  handleCancel = () => {
    APP.dispatch({
      type: `${namespace}/cancelRefund`,
      payload: {
        id: this.props.match.params.id,
        info: this.props.form.getFieldValue('info')
      }
    })
  }
  showModal = () => {
    this.setState({
      visible: true
    })
  }
  hideModal = () => {
    this.setState({
      visible: false
    })
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return this.props.cancel ? (
      <>
        <Modal title="取消售后" onCancel={this.hideModal} onOk={this.handleCancel} visible={this.state.visible}>
          <Form>
            <Form.Item label="说明">
              {getFieldDecorator('info')(<TextArea />)}
            </Form.Item>
          </Form>
        </Modal>
        <Button type="danger" style={this.props.style} onClick={this.showModal}>取消售后</Button>
      </>
    ) : null;
  }
}

export default withRouter(Form.create<Props>({})(CancelAfterSale));