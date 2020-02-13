import React from 'react'
import { Tabs, Card } from 'antd';
import { setQuery, parseQuery } from '@/util/utils';
import {enumSettleType, TextMapSettleStatus} from '../constant'
import List from './list';

const { TabPane } = Tabs;
class SettleMent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status:  parseQuery().status || '0'
    };
    
  }
  componentDidMount(){
    this.handleTabClick(this.state.status)
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
          {Object.values(enumSettleType).map(item=>{
            return <TabPane tab={TextMapSettleStatus[item]} key={item} />
          })}
        </Tabs>
        <List status={status} />
      </Card>
    </div>
    )
  }
}
export default SettleMent