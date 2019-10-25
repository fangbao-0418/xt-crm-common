// 手动发码
import React from 'react';
import { Modal, Card, Form, Input, DatePicker, Select, Button, Table, Divider, message, Row, Col } from 'antd';
import { parseQuery } from '@/util/utils';
import DateFns from 'date-fns';
const FormItem = Form.Item;
class Add extends React.Component {
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
        }
    }
    handleReset = () => {
        this.props.form.resetFields();
    };
    handleSearch = () => {
        debugger
        const { form: { validateFields },} = this.props;
        validateFields((err, vals) => {
            if (!err) {
              const params = {
                ...vals,
                startTime: vals.time && vals.time[0] && +new Date(vals.time[0]),
                endTime: vals.time && vals.time[1] && +new Date(vals.time[1]),
                page: 1,
                pageSize: 20
              };
      
              delete params.time;
            }
          });
    }

    render(h) {
        const { listData, page} = this.state;

        const columns = [
            {
                title: '订单号码',
                dataIndex: 'number',
            },
            {
                title: '订单状态',
                dataIndex: 'status',
                render: text=><a>{text}</a>
            },
            {
                title: '下单时间',
                dataIndex: 'addtime',
                render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
            },
            {
                title: '实付金额',
                dataIndex: 'jine',
                render: text => <>￥{text}</>
            },
            {
                title: '下单人手机',
                dataIndex: 'phone',
            },
        ]

        const data = [
            {
              key: '1',
              number: '221121212',
              status: 0,
              jine: '188',
              phone: '1301581313'
            },
            {
                key: '2',
                number: '221121212',
                status: 0,
                jine: '188',
                phone: '1301581313'
            },
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
            //   name: record.name,
            }),
          };
        const {
            form: { getFieldDecorator },
          } = this.props;
        const { initParams } = this.state;

        return (
            <>
            <Card>
            <Form layout="inline">
                      <FormItem label="主订单号">
                          {
                              getFieldDecorator('number1')
                              (<Input placeholder="请输入主订单号编号"/>)
                          }
                      </FormItem>
                      <FormItem label="下单手机号">
                          {
                              getFieldDecorator('phone')
                              (<Input placeholder="请输入下单手机号"/>)
                          }
                      </FormItem>
                      <FormItem>
                        <Button type="primary" onClick={this.handleSearch}>
                            查询
                        </Button>
                        <Button type="primary" onClick={this.handleReset} style={{ marginLeft: 20 }}>
                            重置
                        </Button>
                       </FormItem>
                  </Form>
            </Card>
            <div>只可以查询10月25日-11月11日的订单 </div>
            <Card>
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} />,
            </Card>
            <div style={{textAlign:"right"}}>
            <Button onClick={this.handleReset}>
                取消
            </Button>
            <Button type="primary" onClick={this.handleReset} style={{ marginLeft: 30 }}>
                确定
            </Button>
            </div>
            </>
        )
    }
}
export default Form.create()(Add)