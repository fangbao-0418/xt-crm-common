/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Modal,
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  Divider,
  message,
} from 'antd';
import DateFns from 'date-fns';
import { getPromotionList, disablePromotion, enablePromotion } from './api';
import Add from './add';
import moment from 'moment';
import { setQuery, parseQuery, gotoPage } from '@/util/utils';
import activityType from '../../enum/activityType';
import { isNil, omitBy } from 'lodash';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

class List extends React.Component {
  constructor(props) {
    super(props);
    const params = parseQuery();
    this.state = {
      listData: [],
      page: {
        current: +params.page || 1,
        total: 0,
        pageSize: 20,
      },
      initParams: params,
      visible: false,
    };
  }

  componentDidMount() {
    const params = parseQuery();
    this.getPromotionList(params);
  }

  setDisablePromotion = ids => {
    disablePromotion({ promotionIds: ids }).then(res => {
      res && message.success('关闭成功');
      this.getPromotionList();
    });
  };

  setEnablePromotion = ids => {
    enablePromotion({ promotionIds: ids }).then(res => {
      res && message.success('开启成功');
      this.getPromotionList();
    });
  };

  getPromotionList = params => {
    const { page } = this.state;
    getPromotionList({ page: page.current, pageSize: page.pageSize, ...params }).then(
      (res = {}) => {
        page.total = res.total;

        this.setState({
          listData: res.records,
          page,
        });
        setQuery({ page: page.current, pageSize: page.pageSize, ...params });
      },
    );
  };

  handleSearch = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        let params = {
          ...vals,
          startTime: vals.time && vals.time[0] && +new Date(vals.time[0]),
          endTime: vals.time && vals.time[1] && +new Date(vals.time[1]),
          page: 1,
          pageSize: 20,
        };
        params = omitBy(params, (val, key) => {
          return key === 'time' || isNil(val) || val === '';
        });
        this.getPromotionList(params);
      }
    });
  };

  resetSearch = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.handleSearch();
  };

  handleTabChange = e => {
    this.setState(
      {
        page: e,
      },
      () => {
        const params = parseQuery();
        this.getPromotionList({
          ...params,
          page: e.current,
          pageSize: e.pageSize,
        });
      },
    );
  };

  hanadleDisablePromotion = id => () => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要关闭该活动吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.setDisablePromotion([].concat(id));
      },
    });
  };

  handleEnablePromotion = id => () => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要开启该活动吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.setEnablePromotion([].concat(id));
      },
    });
  };

  render() {
    const { listData, page } = this.state;
    const columns = [
      {
        title: '排序',
        dataIndex: 'sort',
        width: 100,
      },
      {
        title: '活动ID',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '活动名称',
        dataIndex: 'title',
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>,
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>,
      },
      {
        title: '活动类型',
        dataIndex: 'type',
        render: text => <>{activityType.getValue(text)}</>,
      },
      {
        title: '活动状态',
        dataIndex: 'status',
        render: text => <>{text === 0 ? '关闭' : '开启'}</>,
      },
      {
        title: '操作',
        render: record => (
          <>
            {/* <Link to={`/activity/info/edit/${record.id}?page=${page.current}&pageSize=${page.pageSize}`}>编辑</Link> */}
            <a onClick={() => gotoPage(`/activity/info/edit/${record.id}`)}>编辑</a>
            <Divider type="vertical" />
            {record.status ? (
              <a style={{ color: '#ff6600' }} onClick={this.hanadleDisablePromotion(record.id)}>
                关闭
              </a>
            ) : (
              <a style={{ color: '#ff6600' }} onClick={this.handleEnablePromotion(record.id)}>
                开启
              </a>
            )}
          </>
        ),
      },
    ];

    const {
      form: { getFieldDecorator },
    } = this.props;

    const { initParams } = this.state;

    return (
      <>
        <Card>
          <Form layout="inline">
            <FormItem label="活动名称">
              {getFieldDecorator('name', {
                initialValue: initParams.name,
              })(<Input placeholder="请输入活动名称" style={{ width: 180 }} />)}
            </FormItem>
            <FormItem label="活动ID">
              {getFieldDecorator('id', {
                initialValue: initParams.id,
              })(<Input placeholder="请输入活动ID" style={{ width: 180 }} />)}
            </FormItem>
            <FormItem label="商品名称">
              {getFieldDecorator('productName')(
                <Input placeholder="请输入商品名称" style={{ width: 180 }} />,
              )}
            </FormItem>
            <FormItem label="商品ID">
              {getFieldDecorator('productId')(
                <Input placeholder="请输入商品ID" style={{ width: 180 }} />,
              )}
            </FormItem>
            <FormItem label="活动类型">
              {getFieldDecorator('type', {
                initialValue: Number(initParams.type) || '',
              })(
                <Select placeholder="请选择活动类型" style={{ width: 180 }}>
                  <Option value="">全部</Option>
                  {activityType.getArray().map((val, i) => (
                    <Option value={val.key} key={i}>
                      {val.val}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="活动状态">
              {getFieldDecorator('status', {
                initialValue: initParams.status || '',
              })(
                <Select placeholder="请选择活动类型" style={{ width: 180 }}>
                  <Option value="">全部</Option>
                  <Option value="0">关闭</Option>
                  <Option value="1">开启</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="有效时间">
              {getFieldDecorator('time', {
                initialValue: [
                  initParams.startTime ? moment(+initParams.startTime) : '',
                  initParams.endTime ? moment(+initParams.endTime) : '',
                ],
              })(
                <RangePicker
                  style={{ width: 430 }}
                  format="YYYY-MM-DD HH:mm"
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                />,
              )}
            </FormItem>
            <div style={{ textAlign: 'right', marginTop: 8 }}>
              <Button type="primary" onClick={this.handleSearch}>
                查询
              </Button>
              <Button style={{ marginLeft: 10 }} onClick={this.resetSearch}>
                重置
              </Button>
            </div>
          </Form>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={() => this.setState({ visible: true })}>
              新建活动
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={listData}
            pagination={page}
            rowKey={record => record.id}
            onChange={this.handleTabChange}
          />
        </Card>
        <Modal
          title="活动新增"
          visible={this.state.visible}
          width={1000}
          footer={null}
          onCancel={() =>
            this.setState({
              visible: false,
            })
          }
        >
          <Add
            onOk={() => {
              this.setState({
                visible: false,
              });
              this.handleSearch();
            }}
            history={this.props.history}
          />
        </Modal>
      </>
    );
  }
}

export default Form.create()(List);
