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
      setStatus:  parseQuery().setStatus || ''
    };
    
  }
  componentDidMount(){
    this.handleTabClick(this.state.setStatus)
  }
  handleTabClick = setStatus => {
    this.setState({setStatus})
    setQuery({
      page: 1,
      pageSize: 10,
      setStatus
    }, true);
  };

  render () {
    let {setStatus} = this.state;
    return (
      <div>
      <Card >
        <Tabs activeKey={setStatus} onTabClick={this.handleTabClick}>
          {Object.values(enumSettleType).map(item=>{
            return <TabPane tab={TextMapSettleStatus[item]} key={item} />
          })}
        </Tabs>
        <List setStatus={setStatus} />
      </Card>
    </div>
    )
  }
}
export default SettleMent