import React from 'react'
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
      const { serialNo, storeName, currencyInfo, incomeMoney, disburseMoney, settlementMoney, invoiceUrl, settName, financeSettlementRecordDetailVOList, financeSettlementRecordLogVOList, settStatus, initStatusInfo, createName, createTime } = res;
      this.setState({
        settStatus,
        dataSource: financeSettlementRecordDetailVOList || [],
        settleDetail: {
          serialNo, storeName, currencyInfo, incomeMoney, disburseMoney, settlementMoney, invoiceUrl, settName
        },
        operateDetail: [{
          operateName: createName,
          operateTime: createTime,
          operateTypeInfo: initStatusInfo
        }].concat(financeSettlementRecordLogVOList || [])
      });
    })
  }
  render() {
    let { settleDetail = [], dataSource = [], operateDetail = [], settStatus } = this.state
    return (
      <div>
        {operateDetail.length > 0 && <StepInfo stepinfo={operateDetail} />}
        <List settleDetail={settleDetail} dataSource={dataSource} settStatus={settStatus} />
      </div>
    )
  }
}
export default SettleDetial