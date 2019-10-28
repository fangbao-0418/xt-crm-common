// 查询抽奖码
import React from 'react';
import { Modal, Card, Form, Input, DatePicker, Select, Button, Table, Divider, message, Row, Col } from 'antd';
import { parseQuery } from '@/util/utils';
import DateFns from 'date-fns';
import Add from './add';
import DisableModal from './disable-modal';
import { getLotteryList, lotteryDisable, lotteryEnable } from '../api';
import lotteryType from '@/enum/lotteryType';

const FormItem = Form.Item;
const { Option } = Select;
//中奖类型
const awardStatus = [
    {key:'0', value:'特等奖'},
    {key:'1', value:'一等奖'},
    {key:'2', value:'二等奖'},
    {key:'3', value:'三等奖'},
    {key:'4', value:'四等奖'},
    {key:'5', value:'待抽奖'}
]
const lotteryStatus = [
    {key:'0', value:'已失效'},
    {key:'1', value:'待抽奖'},
    {key:'2', value:'已中奖'}
]
// 数组转枚举
const arrToEnum = (arr) => {
    var result = {}
    arr.map((item) => {
        result[item.key] = item.value
        result[item.value] = item.key
    })
    return result
}

class List extends React.Component {
    constructor(props) {
        super(props);
        const params = parseQuery();
        this.state = {
            listData: [],
            current: +params.page || 1,
            total: 0,
            pageSize: 3,
            initParams: params,
            visible: false,
            selectedRows: [], //选中行内容
            detail: {}
        };
    }
 
    componentDidMount() {
        this.handleSearch()
    }
    // 批量失效
    handleBatchDisable = () => {
        console.log('批量失效',this.state.selectedRows)
        lotteryDisable(this.state.selectedRows).then(res => {
            console.log('批量失效res', res);
        })
    }
    // 批量生效
    handleBatchEnable = () => {
        console.log('批量生效',this.state.selectedRows)
        lotteryEnable(this.state.selectedRows).then(res => {
            console.log('批量生效res', res);
        })
    }
    // 重置
    handleReset = () => {
        this.props.form.resetFields();
    };
    // 查询
    handleSearch = () => {
        const { form: { validateFields }} = this.props;
        validateFields((err, vals) => {
            if (!err) {
              const params = {
                ...vals,
                page: this.state.current,
                pageSize: this.state.pageSize
              };
              console.log('params', params)
              getLotteryList(params).then(res => {
                console.log('res', res)
                if (res) {
                    this.setState({
                        listData: res.records,
                        total: res.total
                    })
                }
              })
            }
          });
    }
    handlePageChange = (page, pageSize) => {
        this.setState(
          {
            current: page,
            pageSize,
          },
          this.handleSearch,
        );
      };

    render(h) {
        const { listData, total, pageSize, current } = this.state;
        console.log('renderState',this.state)
        const columns = [
            {
                title: '抽奖码',
                dataIndex: 'ticketCode',
            },
            {
                title: '主订单号',
                dataIndex: 'mainOrderCode',
                render: (text, record) => {
                    return (
                        <a href={'#/order/detail/15719961174722014125'} target="_blank">{text}</a>
                    )
                }
            },
            {
                title: '抽奖码状态',
                dataIndex: 'lotteryStatus',
                render: (text, record) => {
                    return (
                         <span>{arrToEnum(lotteryStatus)[text]}</span>
                    )
                }
            },
            {
                title: '中奖类型',
                dataIndex: 'award',
                render: text => <>{lotteryType.getValue(text)}</>
            },
            {
                title: '支付时间',
                dataIndex: 'payDate',
                render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
            },
            {
                title: '发放时间',
                dataIndex: 'createTime',
                render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
            },
            {
                title: '操作',
                render(text, record) {
                    return (
                        <><DisableModal></DisableModal></>
                    )
                }
            }
        ];
        const data = [
            {
                ticketCode: '1123123132',
                mainOrderCode: '15720011106952095084',
                lotteryStatus: 0,
                award: 1,
                payDate: 1,
                createTime: 1,
            },
            {
                ticketCode: '1123123132',
                mainOrderCode: '15719961174722014125',
                lotteryStatus: 0,
                award: 1,
                payDate: 1,
                createTime: 1,
              },
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows: selectedRows
                })
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', this.state.selectedRows);
            }
          };
        const {
            form: { getFieldDecorator },
          } = this.props;

          return(
              <>
              <Card>
                  <Form layout="inline">
                      <FormItem label="抽奖码编号">
                          {
                              getFieldDecorator('lotteryTicketCode')
                              (<Input placeholder="请输入抽奖码编号"/>)
                          }
                      </FormItem>
                      <FormItem label="主订单号">
                          {
                              getFieldDecorator('mainOrderCode')
                              (<Input placeholder="请输入主订单号编号"/>)
                          }
                      </FormItem>
                      <FormItem label="下单手机号">
                          {
                              getFieldDecorator('buyerPhone')
                              (<Input placeholder="请输入下单手机号"/>)
                          }
                      </FormItem>
                      <FormItem label="抽奖码状态">
                          {
                              getFieldDecorator('lotteryStatus')
                              (<Select  style={{width: 100}}>
                                  <Option value="">全部</Option>
                                  {
                                    lotteryStatus.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>)
                                  }
                              </Select>)
                          }
                      </FormItem>
                      <FormItem label="中奖类型">
                          {
                              getFieldDecorator('award')
                              (<Select style={{width: 100}}>
                                <Option value="">全部</Option>
                                {
                                    awardStatus.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>)
                                }
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
                            <Button type="primary" disabled={!this.state.selectedRows.length} onClick={this.handleBatchDisable}>
                                批量失效
                            </Button>
                            <Button type="primary" disabled={!this.state.selectedRows.length} onClick={this.handleBatchEnable} style={{ marginLeft: 10 }}>
                                批量生效
                            </Button>
                          </Col>
                          <Col span={2} offset={10}>
                            {/* <Button type="primary" onClick={()=>this.setState({visible: true})} style={{ marginLeft: 10 }}>
                                手动发码
                            </Button> */}
                            <Add />
                          </Col>
                      </Row>
                  </div>
              </Card>
              {/* 表格展示 */}
              <Card>
                  {
                      listData && listData.length > 0 ? (
                        <Table rowSelection={rowSelection} columns={columns} dataSource={listData} 
                        pagination={{
                            current,
                            total,
                            pageSize,
                            onChange: this.handlePageChange,
                        }}
                      />
                      ) : (
                          '暂无数据'
                      )
                  }
              </Card>
              {/* <Modal
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
                </Modal> */}
              </>
          );
    }
}
export default Form.create()(List)