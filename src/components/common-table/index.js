/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-13 16:59:39
 * @FilePath: /xt-crm/src/components/common-table/index.js
 */
import React, { Component } from 'react'
import { Table } from 'antd'
import styles from './index.module.scss'

export default class extends Component {
  displayName = 'common-table'
  showTotal = total => {
    return <span>共{total}条数据</span>
  }

  onChange = (pagination) => {
    const { onChange } = this.props
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize
    }
    if (typeof onChange === 'function') {
      onChange(params)
    }
  }

  render () {
    const { columns = [], dataSource = [], total = 0, current, ...others } = this.props
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
    )
  }
}