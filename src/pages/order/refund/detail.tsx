import React, { Component } from 'react';
import { Card, Table, Tabs } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import AfterSalesDetail from './AfterSalesDetail';
import { namespace } from './model';
interface Logger {
  content: string;
  datetime: number;
  operator: string;
}
const columns: ColumnProps<Logger>[] = [{
  title: '内容',
  dataIndex: 'content',
  key: 'content'
}, {
  title: '时间',
  dataIndex: 'datetime',
  key: 'datetime'
}, {
  title: '操作人',
  dataIndex: 'operator',
  key: 'operator'
}]
interface DetailProps extends RouteComponentProps<{id: any}> {
  data: AfterSalesInfo.data
}
interface DetailState {}
class Detail extends Component<DetailProps, DetailState> {
  public refundId: number;
  constructor(props: DetailProps) {
    super(props);
    this.getDetail = this.getDetail.bind(this);
    this.refundId = Number(this.props.match.params.id);
  }
  private getDetail () {
    APP.dispatch({
      type: `${namespace}/getDetail`,
      payload: { id: this.refundId }
    })
  }
  componentWillMount() {
    this.getDetail();
  }
  render(): React.ReactNode {
    const { skuServerLogVO } = this.props.data;
    const dataSource: any = skuServerLogVO && skuServerLogVO.map((v: any, i: any) => ({...v, uniqueKey: i}));
    return (
      <>
        <Card>
          <Tabs>
            <Tabs.TabPane tab="售后详情" key="1">
              <AfterSalesDetail data={this.props.data} getDetail={this.getDetail} refundId={this.refundId}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="信息记录" key="2">
              <Table rowKey={(record: any, index:number) => String(record.uniqueKey)} dataSource={dataSource} pagination={false} columns={columns} />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </>
    )
  }
}
export default connect((state: any) => {
  return {
    data: state[namespace] && state[namespace].data || {}
  }
})(Detail);