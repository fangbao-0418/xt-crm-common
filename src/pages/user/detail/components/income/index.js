import React, { Component, useState, useEffect } from 'react';
import { Card, Table, Form, Input, Select, InputNumber, Button, Modal } from 'antd';
import { connect, parseQuery } from '@/util/utils';
import MoneyRender from '@/components/money-render'
import { getProceedsListByOrderIdAndMemberId, getProceedsListByOrderIdAndMemberIdAndSkuId } from '../../api';


const ChildOrderTable = (props) => {
    const { record: { mainOrderNo }, memberId } = props;
    const [isFirstLoaded, useIsFirstLoaded] = useState(true)
    const [dataSource, useDataSource] = useState([]);

    useEffect(() => {
        if (isFirstLoaded) {
            getProceedsListByOrderIdAndMemberId({ mainOrderNo, memberId }).then((result) => {
                useDataSource(result);
            })
            useIsFirstLoaded(false);
        }
    })


    const columns = [
        {
            title: '子订单号',
            width: '30%',
            dataIndex: 'childOrderNo',
            render: (childOrderNo, record) => {
                return <a onClick={() => {
                    props.showModal(props.record, record);
                }}>
                    {childOrderNo}
                </a>
            }
        }, {
            title: 'SKU名称',
            width: '25%',
            dataIndex: 'skuName'
        }, {
            title: '商品ID',
            width: '15%',
            dataIndex: 'productId'
        }, {
            title: '收益类型',
            width: '10%',
            dataIndex: 'incomeTypeDesc'
        }, {
            title: '已结算收益',
            width: '10%',
            dataIndex: 'settledAmount',
            render: MoneyRender,
        }, {
            title: '未结算收益',
            width: '10%',
            dataIndex: 'unSettledAmount',
            render: MoneyRender
        }
    ];

    return <>
        <Table
            rowKey={record => record.childOrderNo}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
        />
    </>
};

function getColumns(scope) {
    return [
        {
            title: '订单编号',
            dataIndex: 'orderCode'
        }, {
            title: '收益类型',
            dataIndex: 'incomeTypeDesc',
        }, {
            title: '已结算收益',
            dataIndex: 'settledAmount',
            render: MoneyRender,
        }, {
            title: '未结算收益',
            dataIndex: 'unSettledAmount',
            render: MoneyRender
        }
    ];
}



const namespace = 'user.userinfo';

@connect(state => ({
    data: state['user.userinfo'].incomeConfig
}))
@Form.create()
export default class extends Component {

    constructor(props) {
        super(props);
        const { getInstance } = this.props;
        if (typeof getInstance === 'function') getInstance(this);
        this.state = {
            visible: false,
            detailList: []
        }
    }

    componentDidMount() {
        this.handleSearch();
    }

    handleSearch = (params = {}) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { dispatch, history } = this.props;
                const obj = parseQuery(history);
                const payload = {
                    memberId: obj.memberId,
                    orderCode: values.orderCode || undefined,
                    incomeTypeCode: values.incomeTypeCode || undefined,
                    minSettledAmount: values.minSettledAmount || undefined,
                    maxSettledAmount: values.maxSettledAmount || undefined,
                    minUnSettledAmount: values.minUnSettledAmount || undefined,
                    maxUnSettledAmount: values.maxUnSettledAmount || undefined,
                    pageNum: params.current || 1,
                    pageSize: params.pageSize || 10
                };
                dispatch[namespace].getIncome(payload);
            }
        })

    }

    onChange = (pagination) => {
        this.handleSearch(pagination)
    }

    expandedRowRender = (record, index, indent, expanded) => {
        const obj = parseQuery();
        return expanded ? <ChildOrderTable record={record} memberId={obj.memberId} showModal={this.showModal} /> : null;
    }

    showModal = (mainOrder, childOrder) => {
        const { memberId } = parseQuery();
        const { mainOrderNo } = mainOrder;
        const { skuId } = childOrder;
        getProceedsListByOrderIdAndMemberIdAndSkuId({ mainOrderNo, memberId, skuId }).then((result) => {
            this.setState({
                detailList: result,
                visible: true
            });
        });
    }

    render() {
        const { data, form: { getFieldDecorator } } = this.props;
        const { detailList, visible } = this.state;

        const detailColumns = [
            {
                title: '时间',
                width: '15%',
                dataIndex: 'occurrenceTime'
            }, {
                title: '收益类型',
                width: '15%',
                dataIndex: 'incomeTypeDesc'
            }, {
                title: '事件',
                width: '15%',
                dataIndex: 'operatorTypeDesc'
            }, {
                title: '收益金额',
                width: '15%',
                dataIndex: 'amount'
            }, {
                title: '结算状态',
                width: '20%',
                dataIndex: 'settleStatus'
            }, {
                title: '结算时间',
                width: '20%',
                dataIndex: 'settleTime',
            }
        ];
        return (
            <Card title="收益列表">
                <Form layout="inline" style={{ paddingBottom: 24 }}>
                    <Form.Item label="订单编号">
                        {getFieldDecorator(`orderCode`)(<Input style={{ width: 140 }} />)}
                    </Form.Item>

                    <Form.Item label="收益类型">
                        {
                            getFieldDecorator(`incomeTypeCode`)(
                                <Select style={{ width: 100 }}>
                                    <Select.Option value=''>全部</Select.Option>
                                    <Select.Option value='10'>价差收益</Select.Option>
                                    <Select.Option value='20'>平推奖励</Select.Option>
                                </Select>)
                        }
                    </Form.Item>

                    <Form.Item label="已结算收益金额" style={{ marginRight: 0 }}>
                        {
                            getFieldDecorator(`minSettledAmount`)(<InputNumber min={0} precision={2} style={{ width: 60 }} />)
                        }
                        <span style={{ padding: '0 8px' }}>-</span>
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator(`maxSettledAmount`)(<InputNumber min={0} precision={2} style={{ width: 60 }} />)
                        }
                    </Form.Item>

                    <Form.Item label="未结算收益金额" style={{ marginRight: 0 }}>
                        {
                            getFieldDecorator(`minUnSettledAmount`)(<InputNumber min={0} precision={2} style={{ width: 60 }} />)
                        }
                        <span style={{ padding: '0 8px' }}>-</span>
                    </Form.Item>

                    <Form.Item>
                        {
                            getFieldDecorator(`maxUnSettledAmount`)(<InputNumber min={0} precision={2} style={{ width: 60 }} />)
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={this.handleSearch}>查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => this.props.form.resetFields()}>清除</Button>
                    </Form.Item>
                </Form>
                <Table
                    dataSource={data.list}
                    columns={getColumns(this)}
                    pagination={{
                        current: data.pageNum,
                        pageSize: parseInt(data.pageSize),
                        total: data.total,
                        showSizeChanger: true,
                        showQuickJumper: true
                    }}
                    rowKey={records => records.mainOrderNo}
                    onChange={this.onChange}
                    expandedRowRender={this.expandedRowRender}
                />
                <Modal
                    title={"收益详细历史记录"}
                    visible={visible}
                    width="900px"
                    bodyStyle={{
                        padding: 0,
                        minHeight: 540
                    }}
                    footer={[
                        <Button type="primary" key="back" onClick={() => {
                            this.setState({
                                visible: false
                            })
                        }}>取消</Button>
                    ]}
                >
                    <Table
                        rowKey={record => record.id}
                        columns={detailColumns}
                        dataSource={detailList}
                        pagination={false}
                        scroll={{ y: 540 }}
                    />
                </Modal>
            </Card>
        );
    }
}