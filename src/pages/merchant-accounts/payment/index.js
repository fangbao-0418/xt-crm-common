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
      status:  parseQuery().status || '0'
    };
   
  }
  componentDidMount(){
    this.handleTabClick(parseQuery().status || '0')
  }
  handleTabClick = status => {
    this.setState({status})
    setQuery({
      page: 1,
      pageSize: 10,
      status
    }, true);
  };

  render () {
    let {status} = this.state;
    return (
      <div>
      <Card >
        <Tabs activeKey={status} onTabClick={this.handleTabClick}>
          {Object.values(enumPayType).map(item=>{
            return <TabPane tab={TextMapPayStatus[item]} key={item} />
          })}
        </Tabs>
        <List />
      </Card>
    </div>
    )
  }
}
export default PayMent