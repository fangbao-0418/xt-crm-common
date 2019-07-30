import React, { Component } from 'react';
import { Card, Row, Col, Table, Input, Form, DatePicker, Button, Tooltip } from 'antd';
import moment from 'moment';
import { connect } from '@/util/utils';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

function getColumns(scope) {
  return [
    {
      title: '提现单号',
      dataIndex: 'withdrawalCode'
    }, {
      title: '支付流水号',
      dataIndex: 'payOrderNo',
      render(v) {
        if (v && v !== '0') return v
      }
    }, {
      title: '申请时间',
      dataIndex: 'createTime',
      render(v) {
        return v ? moment(v).format(timeFormat) : ''
      }
    }, {
      title: '到账时间',
      dataIndex: 'arriveTime',
      render(v) {
        return v ? moment(v).format(timeFormat) : ''
      }
    }, {
      title: '提现金额',
      dataIndex: 'money',
      render(v) {
        return <span>{v / 100}</span>
      }
    }, {
      title: '提现方式',
      dataIndex: 'accountType'
    }, {
      title: '提现账号',
      dataIndex: 'accountNumber',
      render(v, record) {
        return `${v} (${record.accountUserName})`
      },
    }, {
      title: '手机号',
      dataIndex: 'phone'
    }, {
      title: '状态',
      dataIndex: 'transferStatusDO.value',
    }, {
      title: '备注',
      dataIndex: 'description',
      render(v) {
        if (v && v !== '0') {
          if (v.length > 5) {
            const base = v.slice(0, 5);
            return <Tooltip title={v}>{base}...</Tooltip>
          } else {
            return v;
          }
        }
      }
    }
  ];
}

const basePayload = {
  page: 1,
  pageSize: 10
};

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(state => ({
  data: state['finance.log'].tableConfig,
  loading: state.loading.effects['finance.log'].getData
}))
@Form.create()
export default class extends Component {

  state = {
    loading: false
  }

  componentDidMount() {
    this.handleSearch();
  }

  showTotal = total => {
    return <span>共{total}条数据</span>
  }

  handleSearch = (params = {}) => {
    const { form: { validateFields }, dispatch } = this.props;
    validateFields((errors, values) => {
      const { time } = values;
      const payload = {
        ...basePayload,
        ...values,
        withdrawalStartDate: time && time[0] && time[0].format(timeFormat),
        withdrawalEndDate: time && time[1] && time[1].format(timeFormat),
        time: undefined, // 覆盖values.time
        ...params
      };
      this.setState({
        loading: true
      })
      dispatch['finance.log'].getData(payload).finally(() =>{
        this.setState({
          loading: false
        })
      })
      
    })
  }
  exportFile = () => {
    const { form: { validateFields }, dispatch } = this.props;
    validateFields((errors, values) => {
      const { time } = values;
      const payload = {
        ...values,
        withdrawalStartDate: time && time[0] && time[0].format(timeFormat),
        withdrawalEndDate: time && time[1] && time[1].format(timeFormat),
        time: undefined, // 覆盖values.time
      };
      dispatch['finance.log'].exportFile(payload);
    })
  }
  renderForm = () => {
    const { form: { getFieldDecorator, resetFields } } = this.props;
    return (
      <Form layout="inline">
        <FormItem label="提现单号">
          {
            getFieldDecorator('withdrawalCode')(
              <Input />
            )
          }
        </FormItem>
        <FormItem label="手机号">
          {
            getFieldDecorator('phone')(
              <Input />
            )
          }
        </FormItem>
        <FormItem label="姓名">
          {
            getFieldDecorator('userName')(
              <Input />
            )
          }
        </FormItem>
        <FormItem label="支付流水号">
          {
            getFieldDecorator('payOrderNo')(
              <Input />
            )
          }
        </FormItem>
        <FormItem label="申请时间">
          {
            getFieldDecorator('time')(
              <RangePicker
                showTime
              />
            )
          }
        </FormItem>
        <FormItem>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.handleSearch()}>查询</Button>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => resetFields()}>清除条件</Button>
          <Button type="primary" onClick={() => this.exportFile()}>导出</Button>
        </FormItem>
      </Form>
    )
  }
  onChange = (pageConfig) => {
    const params = {
      page: pageConfig.current,
      pageSize: pageConfig.pageSize
    };
    this.handleSearch(params);
  }
  render() {
    const { data, loading } = this.props;
    return (
      <Card>
        <Row>
          <Col style={{ marginBottom: 20 }}>
            {this.renderForm()}
          </Col>
          <Col>
            <Table
              dataSource={data.records}
              columns={getColumns(this)}
              pagination={{
                total: data.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: this.showTotal,
                current: data.current
              }}
              rowKey={records => records.id}
              onChange={this.onChange}
              loading={loading}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}