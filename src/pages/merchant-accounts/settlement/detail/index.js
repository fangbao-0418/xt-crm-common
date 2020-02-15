import React from 'react'
import { Tabs, Card } from 'antd';
import { setQuery, parseQuery } from '@/util/utils';
import StepInfo from './step-info';
import List from './list';
import * as api from '../../api'

class SettleDetial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      // 结算记录
      dataSource: [],
      // 结算明细
      settleDetail: {}
    };
  }
  componentDidMount() {
    let { id } = this.props.match.params;
    this.fetchData(id)
  }
  // 列表数据
  fetchData(id) {
    api.getSettlementDetail(id).then((res = {}) => {
      console.log(res)
      const { id, storeName, currencyInfo, incomeMoney, disburseMoney, settlementMoney, invoiceUrl, financeSettlementRecordDetailVOList ,financeSettlementRecordLogVOList} = res;
      this.setState({
        dataSource: financeSettlementRecordDetailVOList || [],
        settleDetail: {
          id, storeName, currencyInfo, incomeMoney, disburseMoney, settlementMoney, invoiceUrl
        },
        operateDetail: financeSettlementRecordLogVOList || []
      });
    })
  }
  render() {

    const { settleDetail=[], dataSource=[], operateDetail=[] } = this.state
    console.log(dataSource)
   



    return (
      <div>
        {operateDetail.length > 0 && <StepInfo stepinfo={operateDetail} />}
        <List settleDetail={settleDetail} dataSource={dataSource} />
      </div>
    )
  }
}
export default SettleDetial