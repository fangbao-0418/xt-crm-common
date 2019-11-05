// 手动发码
import React from 'react';
import { Modal, Card, Form, Input, DatePicker, Select, Button, Table, Radio } from 'antd';
import DateFns from 'date-fns';
import { getPromotionList } from '../api';
import moment from 'moment';
import { parseQuery, gotoPage } from '@/util/utils';
import activityType from '@/enum/activityType';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

class ActivityList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: '',
      listData: [],
      page: {
        current: 1,
        total: 0,
        pageSize: 20,
      },
      visible: false,
    };
  }

  getPromotionList = params => {
    const { page } = this.state;
    getPromotionList(params).then((res = {}) => {
      page.total = res.total;

      this.setState({
        listData: res.records,
      });
    });
  };

  handleSearch = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, vals) => {
      if (!err) {
        const params = {
          ...vals,
          startTime: vals.time && vals.time[0] && +new Date(vals.time[0]),
          endTime: vals.time && vals.time[1] && +new Date(vals.time[1]),
          page: this.state.page.current,
          pageSize: this.state.page.pageSize,
        };

        delete params.time;

        this.getPromotionList(params);
      }
    });
  };

  handleTabChange = e => {
    this.setState(
      {
        page: e,
      },
      this.handleSearch,
    );
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
    this.handleReset();
  };
  handleCancel = e => {
    this.setState({
      visible: false,
      selectedId: '',
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
    this.setState(
      {
        page: {
          current: 1,
          total: 0,
          pageSize: 20,
        },
      },
      this.handleSearch,
    );
  };
  render(h) {
    const { listData, page, selectedId } = this.state;
    const columns = [
      {
        title: '',
        width: 30,
        render: (text, row, index) => (
          <Radio
            onClick={() =>
              this.setState({
                selectedId: row.id,
              })
            }
            checked={row.id === selectedId}
          ></Radio>
        ),
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
    ];

    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <>
        <span className="href" onClick={this.showModal} style={{ marginRight: 20 }}>
          批量转移
        </span>
        <Modal
          title="选择活动"
          className="modalStyle"
          width={1000}
          visible={this.state.visible}
          footer={
            <>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={this.handleCancel.bind(this)}>取消</Button>
                <Button
                  type="primary"
                  disabled={!selectedId}
                  onClick={() => {
                    this.props.confirm(selectedId)
                    this.handleCancel()
                  }}
                  style={{ marginLeft: 30 }}
                >
                  确定
                </Button>
              </div>
            </>
          }
          onCancel={this.handleCancel}
        >
          <Card>
            <Form layout="inline">
              <FormItem label="活动名称">
                {getFieldDecorator('name')(<Input placeholder="请输入活动名称" />)}
              </FormItem>
              <FormItem label="有效期">
                {getFieldDecorator('time')(
                  <RangePicker
                    format="YYYY-MM-DD HH:mm"
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('23:59:59', 'HH:mm:ss'),
                      ],
                    }}
                  />,
                )}
              </FormItem>
              <FormItem label="活动类型">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择活动类型" style={{ width: 100 }}>
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
                {getFieldDecorator('status')(
                  <Select placeholder="请选择活动类型" style={{ width: 100 }}>
                    <Option value="">全部</Option>
                    <Option value="0">关闭</Option>
                    <Option value="1">开启</Option>
                  </Select>,
                )}
              </FormItem>
              <FormItem label="商品id">
                {getFieldDecorator('pid')(<Input placeholder="请输入商品id" />)}
              </FormItem>
              <FormItem label="商品名称">
                {getFieldDecorator('pname')(<Input placeholder="请输入商品名称" />)}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState(
                      {
                        current: 1,
                      },
                      this.handleSearch,
                    );
                  }}
                >
                  查询
                </Button>
                <Button type="primary" onClick={this.handleReset} style={{ marginLeft: 20 }}>
                  重置
                </Button>
              </FormItem>
            </Form>
          </Card>
          <Card>
            <Table
              columns={columns}
              dataSource={listData}
              pagination={page}
              rowKey={record => record.id}
              onChange={this.handleTabChange}
              scroll={{ y: 400 }}
            />
          </Card>
        </Modal>
      </>
    );
  }
}
export default Form.create()(ActivityList);
