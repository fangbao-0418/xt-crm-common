import React from 'react';
import { Modal, Card, Form, Input, DatePicker, Select, Button, Table, Radio } from 'antd';
import DateFns from 'date-fns';
import { getPromotionList } from '../api';
import moment from 'moment';
import activityType from '@/enum/activityType';
import { FormComponentProps } from 'antd/es/form';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface UserFormProps extends FormComponentProps {
  text?: string;
  info?: any;
  confirm: (selectedRow: any) => void;
  activityType?: number[]
}

class ActivityList extends React.Component<UserFormProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedRow: undefined,
      listData: [],
      page: {
        current: 1,
        total: 0,
        pageSize: 20
      },
      visible: false
    };
  }

  getPromotionList = (params: any) => {
    const { page } = this.state;
    if (params && !params.type) {
      params.types = [1, 2, 3];
    }
    getPromotionList(params).then((res: any = {}) => {
      page.total = res.total;
      this.setState({
        listData: res.records
      });
    });
  };

  handleSearch = () => {
    const {
      form: { validateFields }
    } = this.props;
    validateFields((err: any, vals: any) => {
      if (!err) {
        const params = {
          ...vals,
          startTime: vals.time && vals.time[0] && +new Date(vals.time[0]),
          endTime: vals.time && vals.time[1] && +new Date(vals.time[1]),
          page: this.state.page.current,
          pageSize: this.state.page.pageSize
        };

        delete params.time;

        this.getPromotionList(params);
      }
    });
  };

  handleTabChange = (e: any) => {
    this.setState(
      {
        page: e
      },
      this.handleSearch
    );
  };

  showModal = () => {
    this.setState({
      visible: true
    });
    this.handleReset();
  };

  handleCancel = (e?: any) => {
    this.setState({
      visible: false,
      selectedRow: undefined
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.setState(
      {
        page: {
          current: 1,
          total: 0,
          pageSize: 20
        }
      },
      this.handleSearch
    );
  };

  render() {
    const { info = {} } = this.props;
    const columns = [
      {
        title: '',
        render: (text: any, row: any, index: any) => (
          <Radio
            onClick={() =>
              this.setState({
                selectedRow: row
              })
            }
            disabled={row.id === info.id}
            checked={row.id === selectedRow.id}
          ></Radio>
        )
      },
      {
        title: '活动ID',
        dataIndex: 'id',
        width: 100
      },
      {
        title: '活动名称',
        dataIndex: 'title',
        width: 150
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render: (text: any) => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        render: (text: any) => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
      },
      {
        title: '活动类型',
        dataIndex: 'type',
        width: 100,
        render: (text: any) => <>{activityType.getValue(text)}</>
      },
      {
        title: '活动状态',
        dataIndex: 'status',
        width: 100,
        render: (text: any) => <>{text === 0 ? '关闭' : '开启'}</>
      }
    ];

    const { listData, page, selectedRow = {} } = this.state as any;
    const {
      form: { getFieldDecorator },
      text = '批量转移'
    } = this.props as any;
    return (
      <>
        <span className="href" onClick={this.showModal} style={{ marginRight: 20 }}>
          {text}
        </span>
        <Modal
          title="选择活动"
          className="modalStyle"
          width={1030}
          visible={this.state.visible}
          maskClosable={false}
          footer={
            <>
              <div style={{ textAlign: 'right' }}>
                <Button onClick={this.handleCancel.bind(this)}>取消</Button>
                <Button
                  type="primary"
                  disabled={!selectedRow.id}
                  onClick={() => {
                    this.props.confirm(selectedRow);
                    this.handleCancel();
                  }}
                  style={{ marginLeft: 16 }}
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
                {getFieldDecorator('name')(<Input placeholder="请输入活动名称" style={{ width: 150 }} />)}
              </FormItem>
              <FormItem label="商品ID">
                {getFieldDecorator('productId')(<Input placeholder="请输入商品ID" style={{ width: 150 }} />)}
              </FormItem>
              <FormItem label="商品名称">
                {getFieldDecorator('productName')(<Input placeholder="请输入商品名称" style={{ width: 150 }} />)}
              </FormItem>
              <FormItem label="活动类型">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择活动类型" style={{ width: 150 }}>
                    <Option value="">全部</Option>
                    {activityType
                      .getArray()
                      .filter(val => (this.props.activityType || [1, 2, 3]).includes(val.key))
                      .map((val, i) => (
                        <Option value={val.key} key={i}>
                          {val.val}
                        </Option>
                      ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="有效时间">
                {getFieldDecorator('time')(
                  <RangePicker
                    style={{ width: 372 }}
                    format="YYYY-MM-DD HH:mm"
                    showTime={{
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                    }}
                  />
                )}
              </FormItem>
              <FormItem label="活动状态">
                {getFieldDecorator('status')(
                  <Select placeholder="请选择活动类型" style={{ width: 150 }}>
                    <Option value="">全部</Option>
                    <Option value="0">关闭</Option>
                    <Option value="1">开启</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState(
                      {
                        page: {
                          current: 1,
                          total: 0,
                          pageSize: 20
                        }
                      },
                      this.handleSearch
                    );
                  }}
                >
                  查询
                </Button>
                <Button onClick={this.handleReset} style={{ marginLeft: 20 }}>
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
export default Form.create<UserFormProps>()(ActivityList);
