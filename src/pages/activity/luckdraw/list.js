// 查询抽奖码
import React from 'react';
import { Modal, Card, Form, Input, DatePicker, Select, Button, Table, Divider, message, Row, Col } from 'antd';
import { parseQuery } from '@/util/utils';
import DateFns from 'date-fns';
import Add from './add';
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
            visible: false
        };
    }
    componentDidMount(){
        const params = parseQuery();
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
      
            //   this.getPromotionList(params);
            }
          });
    }

    render(h) {
        const { listData, page } = this.state;
        const columns = [
            {
                title: '抽奖码',
                dataIndex: 'number',
            },
            {
                title: '主订单号',
                dataIndex: 'number1',
                render: text=><a>{text}</a>
            },
            {
                title: '抽奖码状态',
                dataIndex: 'status',
            },
            {
                title: '中奖类型',
                dataIndex: 'type',
            },
            {
                title: '支付时间',
                dataIndex: 'addtime',
                render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
            },
            {
                title: '发放时间',
                dataIndex: 'pushtime',
                render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
            },
            {
                title: '操作',
                render: (text, record) => (
                    <><Button type="primary">生效</Button></>
                )
            }
        ];
        const data = [
            {
              key: '1',
              name: 'John Brown',
              jiang: 0,
              address: 'New York No. 1 Lake Park',
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

          return(
              <>
              <Card>
                  <Form layout="inline">
                      <FormItem label="抽奖码编号">
                          {
                              getFieldDecorator('number')
                              (<Input placeholder="请输入抽奖码编号"/>)
                          }
                      </FormItem>
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
                      <FormItem label="抽奖码状态">
                          {
                              getFieldDecorator('status')
                              (<Select  style={{width: 100}}>
                                  <Option value="">全部</Option>
                                  <Option value="1">带抽奖</Option>
                                  <Option value="2">已中奖</Option>
                                  <Option value="3">已失效</Option>
                              </Select>)
                          }
                      </FormItem>
                      <FormItem label="中奖类型">
                          {
                              getFieldDecorator('jiang')
                              (<Select style={{width: 100}}>
                                <Option value="0">全部</Option>
                                <Option value="1">特等奖</Option>
                                <Option value="2">一等奖</Option>
                                <Option value="3">二等奖</Option>
                                <Option value="4">三等奖</Option>
                                <Option value="5">四等奖</Option>
                            </Select>)
                          }
                      </FormItem>
                      <FormItem>
                        <Button type="primary" onClick={this.handleSearch}>
                            查询
                        </Button>
                        <Button type="primary" onClick={this.handleReset} style={{ marginLeft: 10 }}>
                            重置
                        </Button>
                       </FormItem>
                  </Form>
              </Card>
              <Card>
                  <div>
                      <Row>
                          <Col span={12}>
                            <Button type="primary" onClick={this.handleSearch}>
                                批量失效
                            </Button>
                            <Button type="primary" onClick={this.handleReset} style={{ marginLeft: 10 }}>
                                批量生效
                            </Button>
                          </Col>
                          <Col span={2} offset={10}>
                            <Button type="primary" onClick={()=>this.setState({visible: true})} style={{ marginLeft: 10 }}>
                                手动发码
                            </Button>
                          </Col>
                      </Row>
                  </div>
              </Card>
              {/* 表格展示 */}
              <Card>
              <Table rowSelection={rowSelection} columns={columns} dataSource={data} />,
              </Card>

              <Modal
                title="手动发码"
                visible={this.state.visible}
                width={1000}
                footer={null}
                onCancel={()=>this.setState({
                    visible: false
                })}
                >
                <Add onOk={()=>{
                    this.setState({
                    visible: false
                    });
                    this.handleSearch();
                }} history={this.props.history}/>
                </Modal>
              </>
          );
    }
}
export default Form.create()(List)