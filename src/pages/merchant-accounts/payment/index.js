import React from 'react'
import { Tabs, Card } from 'antd';
import { setQuery, parseQuery } from '@/util/utils';
import List from './list';
import {enumPayType, TextMapPayStatus} from '../constant'
const { TabPane } = Tabs;
const enumPayTypeIndex = {...enumPayType};
delete enumPayTypeIndex.Freezing;
class PayMent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentStatus:  parseQuery().paymentStatus || ''
    };
   
  }
  componentDidMount(){
    this.handleTabClick(parseQuery().paymentStatus || '')
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
          {Object.values(enumPayTypeIndex).map(item=>{
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