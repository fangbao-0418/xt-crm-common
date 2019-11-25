import React, { Component } from 'react';
import { Table } from 'antd';
import { connect, parseQuery, setQuery } from '@/util/utils';
import { formatDate } from '@/pages/helper';

const namespace = 'intercept.detail.log';

@connect(state => ({
  sourceData: state[namespace].sourceData
}))
export default class extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const queryObj = parseQuery();
    let payload = {
      memberId: queryObj.id,
      page: 1,
      pageSize: 10
    };
    dispatch[namespace].getData(payload);
  }

  render() {
    const columns = [
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content'
      },
      {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: date => {
          return formatDate(date);
        }
      },
      {
        title: '操作人',
        dataIndex: 'createUname',
        key: 'createUname'
      }
    ];
    const { sourceData } = this.props;
    return (
      <Table
        bordered
        rowKey={item => item.skuId + item.id}
        columns={columns}
        dataSource={sourceData['records']}
        pagination={{
          ...{
            current: sourceData['current'] || 1,
            pageSize: sourceData['size'] || 10,
            total: sourceData['total'],
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: this.pageChange,
            onShowSizeChange: this.pageChange
          }
        }}
      />
    );
  }

  pageChange = (page, pageSize) => {
    setQuery({
      page,
      pageSize
    });
    this.handleSearch({ page, pageSize });
  };
}
