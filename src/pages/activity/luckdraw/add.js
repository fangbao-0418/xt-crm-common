// 手动发码
import React from 'react';
import { Card, Form, Input, DatePicker, Button, Table, Modal } from 'antd';
import { parseQuery } from '@/util/utils';
import { formatDate, formatMoneyWithSign } from '../../helper';
import DateFns from 'date-fns';
import orderStatus from '@/enum/orderStatus';
import { lotteryManualGive } from './../api'
import { getOrderList } from './../../order/api'
import './../activity.scss'
const FormItem = Form.Item;
class Add extends React.Component {
    constructor(props) {
        super(props);
        const params = parseQuery();
        this.state = {
            visible: false,
            listData: [],
            current: 1,
            total: 0,
            pageSize: 8,
            initParams: params,
            selectedRows: [], // 选中行
            selectedRowKeys: []
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleCancel = e => {
        
        this.setState({
            visible: false,
            selectedRows: [],
            selectedRowKeys: [],
            current: 1
        });
        
    };
    componentDidMount() {
        // this.handleSearch() //默认进来不查询
    }
    handleReset = () => {
        this.props.form.resetFields();
    };
    handleSearch = () => {
        const { form: { validateFields },} = this.props;
        validateFields((err, vals) => {
            if (!err) {
              // 只查询10月25日-11月11日的订单
              const params = {
                ...vals,
                // payStartDate: "2019-10-25 00:00",
                // payEndDate: "2019-11-11 23:59",
                page: this.state.current,
                pageSize: this.state.pageSize
              };
      
              delete params.time;

              getOrderList(params).then(res => {
                  console.log('getOrderList', res)
                  if (res && res.records) {
                    this.setState({
                        selectedRows: [],
                        selectedRowKeys: [],
                        listData: res.records,
                        total: res.total
                    })
                  } else {
                      
                  }
              })
            }
          });
    }
    // 确定添加
    handleAdd = () => {
        console.log('确定添加',this.state.selectedRows)
        let lotteryMemberTicketManualAddVOList = []
        this.state.selectedRows.map((item, index) => {
            lotteryMemberTicketManualAddVOList.push({
                actualPayMoney: item.totalMoney,
                memberId: item.memberId,
                mainOrderId: item.id,
                mainOrderCode: item.orderCode,
                buyerPhone: item.buyerPhone,
                payDate: item.payDate,
            })
        })
        console.log('lotteryMemberTicketManualAddVOList', lotteryMemberTicketManualAddVOList)
        // 添加手动发码
        lotteryManualGive({lotteryMemberTicketManualAddVOList}).then(res => {
            if (res) {
                APP.success("发布成功")
                this.setState({
                    visible: false,
                    selectedRows: [],
                    selectedRowKeys: []
                })
            } else {
                APP.error("发布失败")
            }
        })
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

        const columns = [
            {
                title: '订单号码',
                dataIndex: 'orderCode',
            },
            {
                title: '订单状态',
                dataIndex: 'orderStatus',
                render: text => <>{orderStatus.getValue(text)}</>
            },
            {
                title: '支付时间',
                dataIndex: 'payDate',
                render: text => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
            },
            {
                title: '实付金额',
                dataIndex: 'totalMoney',
                render: text => <>{formatMoneyWithSign(text)}</>
            },
            {
                title: '下单人手机',
                dataIndex: 'buyerPhone',
            },
        ]

        const data = [
            {
              key: '1',
              orderCode: '221121212',
              orderStatus: 0,
              totalMoney: '188',
              buyerPhone: '1301581313'
            },
            {
                key: '2',
                orderCode: '221121212',
                orderStatus: 0,
                totalMoney: '188',
                buyerPhone: '1301581313'
            },
        ]
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRows,
                    selectedRowKeys
                })
              console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            }
          };
        const {
            form: { getFieldDecorator },
          } = this.props;

        return (
            <>
            <Button type="primary" onClick={this.showModal}>手动发码</Button>
            <Modal title="手动发码"
            className="modalStyle"
                width={1000}
                visible={this.state.visible}
                footer={
                    <>
                    <div style={{textAlign:"right"}}>
                        <Button onClick={this.handleCancel.bind(this)}>
                            取消
                        </Button>
                        <Button type="primary" disabled={!this.state.selectedRows.length} onClick={this.handleAdd} style={{ marginLeft: 30 }}>
                            确定
                        </Button>
                    </div>
                    </>
                  }
                  onCancel={this.handleCancel}
                >
            <Card>
                <Form layout="inline">
                      <FormItem label="主订单号">
                          {
                              getFieldDecorator('orderCode')
                              (<Input placeholder="请输入主订单号编号"/>)
                          }
                      </FormItem>
                      <FormItem label="下单手机号">
                          {
                              getFieldDecorator('buyerPhone')
                              (<Input placeholder="请输入下单手机号"/>)
                          }
                      </FormItem>
                      <FormItem>
                        <Button type="primary" onClick={()=>{
                            this.setState({
                                current: 1
                            }, this.handleSearch)
                        }}>
                            查询
                        </Button>
                        <Button type="primary" onClick={this.handleReset} style={{ marginLeft: 20 }}>
                            重置
                        </Button>
                       </FormItem>
                  </Form>
            </Card>
            {/* <div>只可以查询10月25日-11月11日的订单 </div> */}
            <Card>
                <Table rowSelection={rowSelection} columns={columns} dataSource={listData} 
                pagination={{
                    current,
                    total,
                    pageSize,
                    onChange: this.handlePageChange
                }}
                />
            </Card>
            
            </Modal>
            </>
        )
    }
}
export default Form.create()(Add)
