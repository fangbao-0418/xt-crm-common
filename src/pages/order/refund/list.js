import React from 'react';
import { Card, Form, Input, Button, message, Select, DatePicker, Spin, Col, Row } from 'antd';

import { refundList, exportRefund } from '../api';
import SuppilerSelect from '../../../components/suppiler-select';
import CommonTable from '@/components/common-table';
import SearchForm from '@/components/search-form';
import { columns, formFields } from './config';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

export default class extends React.Component {
  static defaultProps = {};

  state = {
    selectedRowKeys: [],
    list: [],
    current: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    tableConfig: {},
  };

  componentDidMount() {
    this.query();
  }

  query = (isExport = false) => {
    // let fieldsValues = this.props.form.getFieldsValue();
    // let rangePickerValue = fieldsValues['rangePicker']
    // delete fieldsValues['rangePicker'];
    // let params = {
    //   ...fieldsValues,
    //   applyStartTime: rangePickerValue && rangePickerValue[0] && rangePickerValue[0].format('YYYY-MM-DD HH:mm'),
    //   applyEndTime: rangePickerValue && rangePickerValue[1] && rangePickerValue[1].format('YYYY-MM-DD HH:mm'),
    //   refundStatus: this.props.refundStatus,
    //   page: this.state.current,
    //   pageSize: this.state.pageSize,
    // };
    // if (isExport) {
    //   this.setState({
    //     loading: true
    //   })
    //   exportRefund(params).then((res) => {
    //     res && message.success('导出成功');
    //   }).finally(() => {
    //     this.setState({
    //       loading: false
    //     })
    //   })
    // } else {
    //   refundList(params).then(res => {
    //     this.setState({
    //       tableConfig: res.data || {}
    //     });
    //   });
    // }
  };

  handleSearch = () => {
    this.query();
  };

  export = () => {
    this.query(true);
  };

  reset = () => {
    this.props.form.resetFields();
  };

  handlePageChange = (pagination) => {
    this.setState(
      {
        current: pagination.page,
        pageSize: pagination.pageSize,
      },
      this.query,
    );
  };

  handleSearch = (data) => {
    console.log(data)
  }

  handleFormat = (data) => {
    console.log(data);
    return data;
  }
  
  render() {
    const { tableConfig: { records = [], total = 0, current = 0 } } = this.state;

    return (
      <Spin tip="操作处理中..." spinning={this.state.loading}>
        <SearchForm
          format={this.handleFormat}
          search={this.handleSearch}
          clear={this.handleSearch}
          options={formFields()}
        >
          <Button type="primary" onClick={this.export}>导出订单</Button>
        </SearchForm>
        <CommonTable
          bordered
          columns={columns({ query: this.query })}
          dataSource={records}
          current={current}
          total={total}
          onChange={this.handlePageChange}
          rowKey={record => record.id}
          scroll={{ x: 1.5 }}
        />
      </Spin>
    );
  }
}
