import React from 'react';
import { Table, Card, Form, Input, Button, DatePicker } from 'antd';
import { querySupplierList, exportSupplier } from '../api';
import SupplierModal from '../supplier-modal';
const FormItem = Form.Item;

const { RangePicker } = DatePicker;

class OrderList extends React.Component {
  static defaultProps = {};

  state = {
    selectedRowKeys: [],
    list: [],
    current: 1,
    pageSize: 20,
    total: 0,
  };

  componentDidMount() {
    this.query();
  }

  query = () => {
    let params = {
      ...this.props.form.getFieldsValue(),
      page: this.state.current,
      pageSize: this.state.pageSize,
    };
    const [startTime, endTime] = params.createTime || [];

    params = {
      ...params,
      createTime: undefined,
      startTime: startTime ? +new Date(startTime) : undefined,
      endTime: endTime ? +new Date(endTime) : undefined,
    };

    querySupplierList(params).then(res => {
      this.setState({
        list: res.records,
        pageSize: res.size,
        total: res.total,
      });
    });
  };

  reset = () => {
    this.props.form.resetFields();
  };
  handleSearch = () => {
    const {
      form: { validateFields },
      orderStatus,
    } = this.props;
    console.log('orderStatus', orderStatus);
    validateFields((err, vals) => {
      if (!err) {
        this.query();
      }
    });
  };
  export = () => {
    let params = {
      ...this.props.form.getFieldsValue(),
      page: this.state.current,
      pageSize: this.state.pageSize,
    };
    const [startTime, endTime] = params.createTime || [];

    params = {
      ...params,
      createTime: undefined,
      startTime: startTime ? +new Date(startTime) : undefined,
      endTime: endTime ? +new Date(endTime) : undefined,
    };

    exportSupplier(params).then(res => {
      console.log(1111);
      debugger;
    });
  };

  handlePageChange = (page, pageSize) => {
    this.setState(
      {
        current: page,
        pageSize,
      },
      this.query,
    );
  };
  render() {
    const { total, pageSize, current } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const columns = [
      {
        title: '供应商ID',
        dataIndex: 'id',
      },
      {
        title: '供应商编码',
        dataIndex: 'code',
      },
      {
        title: '供应商名称',
        dataIndex: 'name',
      },
      {
        title: '联系人',
        dataIndex: 'contacts',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
      },
      {
        title: '联系邮箱',
        dataIndex: 'email',
      },
      {
        title: '操作',
        render: (operator, { id }) => {
          return (
            <>
              <SupplierModal onSuccess={this.query} isEdit id={id} />
              <Button className="ml10" type="primary">创建账号</Button>
              <Button className="ml10" type="primary">查看账号</Button>
            </>
          );
        },
      },
    ].filter(column => !column.hide);
    return (
      <>
        <Card title="筛选">
          <Form layout="inline">
            <FormItem label="供应商名称">
              {getFieldDecorator('name')(<Input placeholder="" />)}
            </FormItem>
            <FormItem label="供应商ID">
              {getFieldDecorator('id')(<Input placeholder="" />)}
            </FormItem>
            <FormItem label="联系人">
              {getFieldDecorator('contacts')(<Input placeholder="" />)}
            </FormItem>
            <FormItem label="供应商编码">
              {getFieldDecorator('code')(<Input placeholder="" />)}
            </FormItem>
            <FormItem label="创建时间">{getFieldDecorator('createTime')(<RangePicker showTime />)}</FormItem>

            <FormItem>
              <Button type="default" onClick={this.reset}>
                清除条件
              </Button>
              <Button type="primary" style={{ margin: '0 10px' }} onClick={this.handleSearch}>
                查询
              </Button>
              <Button type="primary" style={{ margin: '0 10px' }} onClick={this.export}>
                导出供应商
              </Button>
            </FormItem>
          </Form>
          <SupplierModal onSuccess={this.query} isEdit={false} />
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Table
            bordered
            columns={columns}
            dataSource={this.state.list}
            pagination={{
              current,
              total,
              pageSize,
              onChange: this.handlePageChange,
            }}
            rowKey={record => record.id}
          />
        </Card>
      </>
    );
  }
}

export default Form.create()(OrderList);
