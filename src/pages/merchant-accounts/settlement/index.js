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
      settType:  parseQuery().settType || ''
    };
    
  }
  componentDidMount(){
    this.handleTabClick(this.state.settType)
  }
  handleTabClick = settType => {
    this.setState({settType})
    setQuery({
      page: 1,
      pageSize: 10,
      settType
    }, true);
  };

  render () {
    let {settType} = this.state;
    return (
      <div>
      <Card >
        <Tabs activeKey={settType} onTabClick={this.handleTabClick}>
          {Object.values(enumSettleType).map(item=>{
            return <TabPane tab={TextMapSettleStatus[item]} key={item} />
          })}
        </Tabs>
        <List settType={settType} />
      </Card>
    </div>
    )
  }
}
export default SettleMent