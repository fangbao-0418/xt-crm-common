import React from 'react';
import { Button, Modal } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { namespace } from '../../refund/model';
interface Props extends RouteComponentProps<{id: any}> {
  cancel: boolean
}
class CancelAfterSale extends React.Component<Props, {}> {
  handleCancel = () => {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认取消售后',
      onOk: () => {
        APP.dispatch({
          type: `${namespace}/cancelRefund`,
          payload: {
            id: this.props.match.params.id
          }
        })
      }
    })
  }
  render() {
    return this.props.cancel ? <Button type="danger" onClick={this.handleCancel}>取消售后</Button>: null;
  }
}

export default withRouter(CancelAfterSale);