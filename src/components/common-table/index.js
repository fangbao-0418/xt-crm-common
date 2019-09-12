import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './index.module.scss';

export default class extends Component {

  showTotal = total => {
    return <span>共{total}条数据</span>
  }

  onChange = (pagination) => {
    const { onChange } = this.props;
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    if (typeof onChange === 'function') onChange(params);
  }

  render() {
    const { columns = [], dataSource = [], total = 0, current, ...others } = this.props;
    return (
      <Table
        className={styles.CommonTable}
        {...others}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          total,
          current,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: this.showTotal
        }}
        onChange={this.onChange}
      />
    );
  }
}