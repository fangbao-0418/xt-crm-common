import React, { Component } from 'react';
import moment from 'moment';
import { Card, Row, Col, Table, Input } from 'antd';
import { connect, parseQuery } from '@/util/utils';


const timeFormat = 'YYYY-MM-DD HH:mm:ss';

function getColumns(scope) {
    return [
        {
            title: '订单编号',
            dataIndex: 'orderCode',
            render(v) {
                return <a href={`/#/order/detail/${v}`} target="_blank">{v}</a>
            }
        }, {
            title: '订单时间',
            dataIndex: 'createTime',
            render(v) {
                return moment(v).format(timeFormat)
            }
        }, {
            title: '收益金额',
            dataIndex: 'amount',
            render(v) {
                const color = +v > 0 ? 'red' : '';
                return <span style={{ color }}>{v/100}</span>
            }
        }, {
            title: '收益类型',
            dataIndex: 'incomeTypeDO.value'
        }, {
            title: '状态',
            dataIndex: 'statusDO.value'
        }
    ];
}

let currentOrderCode = '';

@connect(state => ({
    data: state['user.userinfo'].incomeConfig
}))
export default class extends Component {

    constructor(props) {
        super(props);
        const { getInstance } = this.props;
        if (typeof getInstance === 'function') getInstance(this);
    }

    componentDidMount() {
        this.handleSearch();
    }
    
    onPressEnter = e => {
        const orderCode = e.target.value;
        const params = {
            orderCode
        };
        this.handleSearch(params);
        currentOrderCode = orderCode;
    }

    handleSearch = (params = {}) => {
        const { dispatch, history } = this.props;
        const obj = parseQuery(history);
        const payload = {
            memberId: obj.memberId,
            orderCode: params.orderCode || currentOrderCode,
            page: params.page || 1,
            pageSize: params.pageSize || 10, 
        };
        dispatch({
            type: 'user.userinfo/getIncome',
            payload
        });
    }

    showTotal = total => {
        return <span>共{total}条数据</span>
    }
    onChange = (pageConfig) => {
        const params = {
            page: pageConfig.current,
            pageSize: pageConfig.pageSize
        };
        this.handleSearch(params);
    }
    componentWillUnmount() {
        currentOrderCode = ''
    }
    render() {
        const { data } = this.props;

        return (
            <Card
                title="收益列表"
            >
                <Row>
                    <Col style={{ marginBottom: 20 }}>
                        <span>订单编号：</span>
                        <Input 
                            onPressEnter={this.onPressEnter}
                            style={{ width: 150 }}
                            placeholder="点击回车进行搜索"
                        />
                    </Col>
                    <Col>
                        <Table 
                            dataSource={data.records}
                            columns={getColumns(this)}
                            pagination={{
                                total: data.total,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: this.showTotal,
                                current: data.current
                            }}
                            // rowKey={records => records.orderId}
                            rowKey={records => `${records.orderId}-${records.incomeType}`}
                            onChange={this.onChange}
                        />
                        {/* <CommonTable
                            dataSource={data.records}
                            columns={getColumns(this)}
                            total={data.total}
                        /> */}
                    </Col>
                </Row>
            </Card>
        );
    }
}