import React from 'react'
import { Tabs, Card } from 'antd';
import { setQuery, parseQuery } from '@/util/utils';
import List from './list';
import {enumPayType, TextMapPayStatus} from '../constant'
const { TabPane } = Tabs;
class PayMent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentStatus:  parseQuery().paymentStatus || '',
      settlementSerialNo:  parseQuery().paymentStatus || ''
    };
   
  }
  componentDidMount(){
    const {paymentStatus = '', settlementSerialNo} = this.state
    if (settlementSerialNo) {
      setQuery({
        page: 1,
        pageSize: 10,
        paymentStatus,
        settlementSerialNo
      }, true);
    } else {
      this.handleTabClick(this.state.paymentStatus || '')
    }
  }
  handleTabClick = paymentStatus => {
    this.setState({paymentStatus})
    setQuery({
      page: 1,
      pageSize: 10,
      paymentStatus
    }, true);
  };

  render () {
    let {paymentStatus} = this.state;

    return (
      <div>
      <Card >
        <Tabs activeKey={paymentStatus} onTabClick={this.handleTabClick}>
          {Object.values(enumPayType).map(item=>{
            return <TabPane tab={TextMapPayStatus[item]} key={item} />
          })}
        </Tabs>
        <List paymentStatus={paymentStatus} />
      </Card>
    </div>
    )
  }
}
export default PayMent