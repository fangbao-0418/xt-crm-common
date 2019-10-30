// 查询抽奖码
import React from 'react';
import { Card, Form, Input, Select, Button, Table, Row, Col } from 'antd';
import { parseQuery } from '@/util/utils';
import DateFns from 'date-fns';
import Add from './add';
import DisableModal from './disable-modal';
import { getLotteryList, lotteryEnable } from '../api';
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
//奖券状态
const status = [
    {key:'0', value:'已失效'},
    {key:'1', value:'已生效'},
    // {key:'2', value:'已中奖'}
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
            pageSize: 10,
            initParams: params,
            visible: false,
            selectedRows: [], //选中行内容
            detail: {}
        };
    }
 
    componentDidMount() {
        this.handleSearch()
    }
    
    // 批量生效
    handleBatchEnable = (selrows) => {
        let rows = []
        if (selrows && selrows.length) {
            //操作栏选择
            rows = selrows.map(item => {
                return item.ticketCode
            })
        } else {
            //多行选择
            rows = this.state.selectedRows.map(item => {
                return item.ticketCode
            })
        }
        console.log('rows', rows)
        lotteryEnable({ ticketCodes: rows }).then(res => {
            if (res) {
                APP.success("操作成功！")
            } else {
                APP.error("操作失败！")
            }
            this.handleSearch();
        })
    }
    // 重置
    handleReset = () => {
        this.props.form.resetFields();
        this.handleSearch();
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
    // 分页
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
                        <a href={'#/order/detail/' + text} target="_blank">{text}</a>
                    )
                }
            },
            {
                title: '手机号',
                dataIndex: 'buyerPhone',
            },
            {
                title: '抽奖码状态',
                dataIndex: 'status',
                render: (text, record) => {
                    return (
                         <span>{arrToEnum(status)[text]}</span>
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
                render: (text, record) => {
                    if (text.status == 1) {
                        return <><DisableModal handleSearch={this.handleSearch} selRow={[text]} btntext={"失效"}></DisableModal></>
                    } else if (text.status == 0) {
                        return <Button type="primary" onClick={() => this.handleBatchEnable([text])}>
                            生效
                        </Button>
                    }
                }
            }
        ];
        const data = [
            {
                ticketCode: '1123123132',
                mainOrderNo: '15720011106952095084',
                status: 0,
                award: 1,
                payDate: 1,
                createTime: 1,
            },
            {
                ticketCode: '1123123132',
                mainOrderNo: '15719961174722014125',
                status: 0,
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
                              getFieldDecorator('ticketCode')
                              (<Input placeholder="请输入抽奖码编号"/>)
                          }
                      </FormItem>
                      <FormItem label="主订单号">
                          {
                              getFieldDecorator('mainOrderNo')
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
                              getFieldDecorator('status', {initialValue: '',})
                              (<Select  style={{width: 100}}>
                                  <Option value="">全部</Option>
                                  {
                                    status.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>)
                                  }
                              </Select>)
                          }
                      </FormItem>
                      <FormItem label="中奖类型">
                          {
                              getFieldDecorator('award', {initialValue: '',})
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
                            <DisableModal handleSearch={this.handleSearch} disabled={!this.state.selectedRows.length} selRow={this.state.selectedRows} btntext={"批量失效"}></DisableModal>
                            <Button type="primary" disabled={!this.state.selectedRows.length} onClick={this.handleBatchEnable} style={{ marginLeft: 10 }}>
                                批量生效
                            </Button>
                          </Col>
                          <Col span={2} offset={10}>
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
              </>
          );
    }
}
export default Form.create()(List)