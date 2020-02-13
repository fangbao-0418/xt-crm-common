import React from 'react'
import { Tabs, Card } from 'antd';
import { setQuery, parseQuery } from '@/util/utils';
import StepInfo from './step-info';
import List from './list';

class SettleDetial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {

    let stepinfo = [
      {
        status: 1,
        statusText: '待结算',
        createName: 'aaa',
        createTime: 1344
      },
      {
        status: 2,
        statusText: '结算中',

        createName: 'aaa',
        createTime: 1344
      },
      {
        status: 3,
        statusText: '已结算',
        createName: 'ccc',
        createTime: 1344
      }
    ]
    // let stepinfo = {
    //   tag: '初审驳回',
    //   list: [
    //     {
    //       status: 1,
    //       statusText: '待结算',
    //       createName: 'aaa',
    //       createTime: 1344
    //     },
    //     {
    //       status: 2,
    //       statusText: '驳回',

    //       createName: 'aaa',
    //       createTime: 1344
    //     }
    //   ]
    // }

    // let stepinfo = {
    //   tag: '复核驳回',
    //   list: [
    //     {
    //       status: 1,
    //       statusText: '待结算',
    //       createName: 'aaa',
    //       createTime: 1344
    //     },
    //     {
    //       status: 2,
    //       statusText: '结算中',

    //       createName: 'aaa',
    //       createTime: 1344
    //     },
    //     {
    //       status: 3,
    //       statusText: '驳回',
    //       createName: 'ccc',
    //       createTime: 1344
    //     }
    //   ]
    // }



    return (
      <div>
        <StepInfo stepinfo={stepinfo} />
        <List />
      </div>
    )
  }
}
export default SettleDetial