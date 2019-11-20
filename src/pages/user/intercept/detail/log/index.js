import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from '@/util/utils';

const namespace = 'intercept.detail.log';

@connect(state => ({
  sourceData: state[namespace].sourceData
}))
export default class extends Component {
  render() {
    const columns = [
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: '时间',
        dataIndex: 'datetime',
        key: 'datetime'
      },
      {
        title: '操作人',
        dataIndex: 'operName',
        key: 'operName'
      }
    ];
    return (
      <Table bordered rowKey={item => item.skuId + item.id} columns={columns} dataSource={[]} pagination={false} />
    );
  }
}
