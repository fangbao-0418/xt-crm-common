import React, { Component } from 'react';
import { connect, parseQuery, setQuery } from '@/util/utils';
import { Card, Row, Col, Form, Input, Select, Button, Table, Popconfirm } from 'antd';
import { usedStatus } from './config';
import styles from './index.module.scss';
import moment from 'moment';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

const FormItem = Form.Item;
const { Option } = Select;
const basePayload = {
  page: 1,
  pageSize: 10,
};
const typeMap = {
  '': '全部',
  10: '礼品购买',
  20: '系统发放'
};

const statusList = ['未使用', '已使用', '已失效'];

function getColumns(scope) {
  return [
    {
      title: '激活码',
      dataIndex: 'activationCode',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render(v) {
        return typeMap[v]
      }
    },
    {
      title: '订单号',
      dataIndex: 'orderCode',
      render(v, rec) {
        return (
          <span className={styles['detail-button']} onClick={() => scope.onInviteClick('orderCode', rec)}>
            {v}
          </span>
        );
      },
    },
    {
      title: '领取人',
      dataIndex: 'nickName',
      render(v, rec) {
        return (
          <span className={styles['detail-button']} onClick={() => scope.onInviteClick('member', rec)}>
            {rec.nickName || rec.memberPhone}
          </span>
        );
      },
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      render(v, rec) {
        return (
            <span style={{ color: v === 1 ? 'red' : '' }}>{statusList[v] || ''}</span>
        );
      },
    },
    {
      title: '使用时间',
      dataIndex: 'activeTime',
      render(v, rec) {
          return v ? moment(v).format(timeFormat) : ''
      }
    },
    {
      title: '使用人',
      dataIndex: 'activeMemberPhone',
      render(v, rec) {
        return (
          <span className={styles['detail-button']} onClick={() => scope.onInviteClick('activeMember', rec)}>
            {v}
          </span>
        );
      },
    },
    {
      title: '操作',
      render(_, record) {
        const { status } = record;
        if (status === 0 && record.type === 20) return (
          <Popconfirm
            title="确认失效吗?"
            onConfirm={() => scope.updateStatus(record)}
          >
            <a>失效</a>
          </Popconfirm>
        )
      }
    }
  ];
}

let unlisten = null;
const namespace = '/user/cdkey';

@connect(state => ({
  tableConfig: state['user.cdkey'].tableConfig,
  loading: state.loading.effects['user.cdkey'].getData,
}))
@Form.create({
  onValuesChange: (props, changeValues, allValues) => {
    APP.fn.setPayload(namespace, allValues)
  }
})
export default class extends Component {
  payload = APP.fn.getPayload(namespace) || {}
  componentDidMount() {
    unlisten = this.props.history.listen(() => {
      const params = parseQuery(this.props.history);
      this.handleSearch(params);
    });
    this.handleSearch(basePayload);
  }

  onInviteClick = (type, item) => {
    const { history } = this.props;
    if (type === 'orderCode') {
        return history.push(`/order/detail/${item.orderCode}`);
    }
    if (type === 'member') {
        return history.push(`/user/detail?memberId=${item.memberId}`);
    }
    if (type === 'activeMember') {
        return history.push(`/user/detail?memberId=${item.activeMemberId}`);
    }
  };

  onMore = item => {
    const {
      form: { resetFields },
    } = this.props;
    const params = parseQuery(this.props.history);
    resetFields();
    if (item.id === +params.parentMemberId) {
      const random = Math.random();
      setQuery({ parentMemberId: item.id, random, ...basePayload }, true);
    } else {
      setQuery({ parentMemberId: item.id, ...basePayload }, true);
    }
  };

  onDetail = item => {
    const { history } = this.props;
    history.push(`/user/detail?memberId=${item.id}`);
  };

  handleSearch = (params = {}) => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        const payload = {
          data: {
            ...values,
            ...params,
          },
          params: {
            ...basePayload,
            ...params,
          },
        };
        setQuery(payload.params)
        dispatch['user.cdkey'].getData(payload);
      }
    });
  };

  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.handleSearch()
  }

  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const values = this.payload
    return (
      <Form layout="inline">
        <FormItem label="订单号">{getFieldDecorator('orderCode', {initialValue: values.orderCode})(<Input />)}</FormItem>
        <FormItem label="类型" className={styles.level}>
          {getFieldDecorator('type', {
            initialValue: values.type || '',
          })(
            <Select>
              {Object.keys(typeMap).reverse().map(item => (
                <Option value={item} key={item}>
                  {typeMap[item]}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem label="领取人">{getFieldDecorator('receiveMemberPhone', {
            initialValue: values.receiveMemberPhone,
          })(<Input placeholder="请填写手机号" />)}</FormItem>
        <FormItem label="使用人">{getFieldDecorator('activeMemberPhone', {
            initialValue: values.activeMemberPhone,
          })(<Input placeholder="请填写手机号" />)}</FormItem>
        <FormItem label="使用状态" className={styles.level}>
          {getFieldDecorator('status', {
            initialValue: values.status || '',
          })(
            <Select>
              {usedStatus.map(item => (
                <Option value={item.value} key={item.value}>
                  {item.key}
                </Option>
              ))}
            </Select>,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.handleSearch()}>
            查询
          </Button>
          <Button type="primary" onClick={() => {
            APP.fn.setPayload(this.payload = {})
            this.handleReset()
            this.forceUpdate()
          }}>
            重置
          </Button>
        </FormItem>
      </Form>
    );
  };

  onChange = pageConfig => {
    const params = {
      page: pageConfig.current,
      pageSize: pageConfig.pageSize,
    };
    setQuery(params);
  };

  showTotal = total => {
    return <span>共{total}条数据</span>;
  };

  updateStatus = (item) => {
    const { id } = item;
    const { form: { getFieldsValue } } = this.props;
    const params = getFieldsValue();
    this.props.dispatch['user.cdkey'].updateStatus({ id }, params);
  }

  componentWillUnmount() {
    unlisten();
  }

  render() {
    const { tableConfig, loading } = this.props;
    return (
      <Card>
        <Row>
          <Col style={{ marginBottom: 20 }}>{this.renderForm()}</Col>
          <Col>
            <Table
              dataSource={tableConfig.records}
              columns={getColumns(this)}
              pagination={{
                total: tableConfig.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: this.showTotal,
                current: tableConfig.current,
              }}
              onChange={this.onChange}
              rowKey={record => record.id}
              loading={loading}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
