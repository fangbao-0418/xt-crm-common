import React from 'react';
import { Modal, Button } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { namespace } from '../../refund/model';
class ComplateAfterSale extends React.Component<RouteComponentProps<{id: any}>, any> {
  constructor(props: RouteComponentProps<{id: any}>) {
    super(props);
    this.hanldeComplate = this.hanldeComplate.bind(this);
  }
  hanldeComplate() {
    Modal.confirm({
      title: '提示',
      content: '是否完成售后？',
      onOk: () => {
        APP.dispatch({
          type: `${namespace}/confirmReceipt`,
          payload: {
            id: this.props.match.params.id
          }
        })
      }
    })
  }
  render() {
    return <Button type="primary" onClick={this.hanldeComplate}>完成售后</Button>;
  }
}
export default withRouter(ComplateAfterSale);
