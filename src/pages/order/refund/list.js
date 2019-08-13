import React from 'react';
import { Button, Spin, Row, Col } from 'antd';
import { refundList } from '../api';
import CommonTable from '@/components/common-table';
import SearchForm from '@/components/search-form';
import { getListColumns, formFields } from './config';
import { withRouter } from 'react-router-dom';
import { formatDate } from '@/pages/helper';
const formatFields = (range) => {
  range = range || [];
  return range.map(v => v && v.format('YYYY-MM-DD HH:mm'))
}

@withRouter
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
    const fieldsValues = this.SearchForm.props.form.getFieldsValue();
    const [applyStartTime, applyEndTime] = formatFields(fieldsValues['apply']);
    const [handleStartTime, handleEndTime] = formatFields(fieldsValues['handle']);
    delete fieldsValues['apply'];
    delete fieldsValues['handle'];
    const params = {
      ...fieldsValues,
      applyStartTime,
      applyEndTime,
      handleStartTime,
      handleEndTime,
      refundStatus: this.props.refundStatus,
      page: this.state.current,
      pageSize: this.state.pageSize,
    };
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
    refundList(params).then(res => {
      this.setState({
        tableConfig: res.data || {}
      })
    })
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

  handleFormat = (data) => {
    console.log(data);
    return data;
  }

  render() {
    const { tableConfig: { records = [], total = 0, current = 0 } } = this.state;

    return (
      <Spin tip="操作处理中..." spinning={this.state.loading}>
        <SearchForm
          wrappedComponentRef={ref => this.SearchForm = ref}
          format={this.handleFormat}
          search={this.handleSearch}
          clear={this.handleSearch}
          options={formFields()}
        >
          <Button type="primary" onClick={this.export}>导出订单</Button>
        </SearchForm>
        {records && records.length? <CommonTable
          bordered
          columns={getListColumns({ query: this.query, history: this.props.history })}
          dataSource={records}
          current={current}
          total={total}
          expandedRowRender={record => (
            <Row className="expanded-row-wrapped" gutter={24}>
              <Col span={6}>售后单编号：{record.orderCode}</Col>
              <Col span={6}>订单编号：{record.mainOrderCode}</Col>
              <Col span={6}>申请时间：{formatDate(record.createTime)}</Col>
            </Row>
          )}
          defaultExpandAllRows={true}
          onChange={this.handlePageChange}
          rowKey={record => record.id}
          scroll={{ x: 1.5 }}
        />: null}
      </Spin>
    );
  }
}
