import React, { Component } from 'react';
import { Card, Table, Tabs } from 'antd';
import { logColumns } from './config';
import { connect } from '@/util/utils';
import AfterSalesDetail from './components/AfterSalesDetail'
// import Step from './components/Step';

@connect(state => ({
  data: state['refund.model'].data || {}
}))
class Detail extends Component {
  constructor(props) {
    super(props);
    this.refundId = this.props.match.params.id;
  }
  getDetail = () => {
    const { dispatch } = this.props;
    dispatch['refund.model'].getDetail({ id: this.refundId })
  }
  componentWillMount(status) {
    this.getDetail();
  }

  render() {
    const { skuServerLogVO = [] } = this.props.data;
    return (
      <>
        {/* <Step data={this.props.data}/> */}
        <Card>
          <Tabs>
            <Tabs.TabPane tab="售后详情" key="1">
              <AfterSalesDetail data={this.props.data} getDetail={this.getDetail} refundId={this.refundId}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="信息记录" key="2">
              <Table rowkey={record => record.uniqueKey} dataSource={skuServerLogVO.map((v, i) => ({...v, uniqueKey: i}))} pagination={false} columns={logColumns} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </>
    )
  }
}
export default Detail;