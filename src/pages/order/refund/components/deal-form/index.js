import React, { Component } from "react";
import { Card } from 'antd';
import CustomerServiceReview from '../customer-service-review';
import ReturnInformation from '../return-information';
import DeliveryInformation from '../delivery-information';
import RefundInformation from '../refund-information';

class DealForm extends Component {
  state = {
    key: 'customer-service-review'
  }
  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  };
  render() {
    const { checkVO = {}, refundStatus, orderServerVO = {}, checkType } = this.props;
    const tabList = [{
      key: 'customer-service-review',
      tab: '客服审核'
    }, {
      key: 'return-information',
      tab: '退货信息'
    }]
    const contentList = {
      'customer-service-review': <CustomerServiceReview checkVO={checkVO} refundStatus={refundStatus}/>,
      'return-information': <ReturnInformation checkVO={checkVO} />
    }
    // 退货退款
    if (orderServerVO.refundType === '10') {
      tabList.push({
        key: 'refund-information',
        tab: '退款信息'
      })
      contentList['refund-information'] = <RefundInformation readOnly={false}/>;
    }
    // 仅换货
    else if (orderServerVO.refundType === '30') {
      tabList.push({
        key: 'delivery-information',
        tab: '发货信息'
      })
      contentList['delivery-information'] = <DeliveryInformation readOnly={false} checkType={checkType} refundType={orderServerVO.refundType} />;
    }
    return (
      <Card
        style={{ width: '100%', minHeight: '352px' }}
        tabList={tabList}
        activeTabKey={this.state.key}
        onTabChange={key => {
          this.onTabChange(key, 'key');
        }}
      >
        {contentList[this.state.key]}
      </Card>
    )
  }
}
export default DealForm