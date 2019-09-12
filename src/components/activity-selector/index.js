import React, { Component } from 'react';
import { Modal, Input } from 'antd';
import { isFunction } from 'lodash';
import { getPromotionList } from './api';
import { actColumns } from './config';
import CommonTable from '@/components/common-table';
import { unionArray } from '@/util/utils';
class ProductSelector extends Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
    activityList: [],
    val: '',
    loading: false,
    pagination: {
      page: 1,
      total: 0,
      pageSize: 10
    }
  }
  handleChangePagination = pagination => {
    this.setState({ pagination }, this.fetchData)
  }
  fetchData = async () => {
    this.setState({ loading: true });
    try {
      const res = await getPromotionList({
        ...this.state.pagination,
        name: this.state.val.trim()
      }) || {};
      console.log('res=>', res);
      this.setState(state => ({
        loading: false,
        pagination: { ...state.pagination, total: res.total },
        activityList: res.records
      }));
    } catch (err) {
      this.setState({ loading: true });
    }
  }
  handleSearch = (val) => {
    this.setState(state => ({
      val,
      pagination: { ...state.pagination, page: 1 }
    }), this.fetchData)
  }
  handleCancel = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: []
    })
    isFunction(this.props.onCancel) && this.props.onCancel();
  }
  handleOkModal = () => {
    isFunction(this.props.onChange) && this.props.onChange(this.state.selectedRowKeys, this.state.selectedRows);
    this.handleCancel()
  }
  componentDidMount() {
    this.fetchData();
  }
  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys=>', selectedRowKeys)
        const unionArrs = unionArray(this.state.selectedRows, selectedRows);
        console.log('selectedRows=>', unionArrs.filter(v => selectedRowKeys.includes(v.id)))
        this.setState({ selectedRowKeys, selectedRows: unionArrs.filter(v => selectedRowKeys.includes(v.id)) })
      }
    }
    return (
      <Modal
        title="选择活动"
        visible={this.props.visible}
        width="60%"
        onCancel={this.handleCancel}
        onOk={this.handleOkModal}
      >
        <Input.Search
          placeholder="请输入需要搜索的活动"
          style={{ marginBottom: 10 }}
          onSearch={this.handleSearch}
        />
        <CommonTable
          loading={this.state.loading}
          rowSelection={rowSelection}
          columns={actColumns()}
          dataSource={this.state.activityList}
          pagination={this.state.pagination}
          onChange={this.handleChangePagination}
          rowKey={record => record.id}
          current={this.state.pagination.page}
          total={this.state.pagination.total}
        />
      </Modal>
    )
  }
}
export default ProductSelector;