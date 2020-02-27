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
      settStatus:  parseQuery().settStatus || ''
    };
    
  }
  componentDidMount(){
    this.handleTabClick(this.state.settStatus)
  }
  handleTabClick = settStatus => {
    this.setState({settStatus})
    setQuery({
      page: 1,
      pageSize: 10,
      settStatus
    }, true);
  };

  render () {
    let {settStatus} = this.state;
    return (
      <div>
      <Card >
        <Tabs activeKey={settStatus} onTabClick={this.handleTabClick}>
          {Object.values(enumSettleType).map(item=>{
            return <TabPane tab={TextMapSettleStatus[item]} key={item} />
          })}
        </Tabs>
        <List settStatus={settStatus} />
      </Card>
    </div>
    )
  }
}
export default SettleMent