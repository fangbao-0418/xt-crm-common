import React, { Component } from 'react';
import { Card, Row, Col, Table } from 'antd';
import { connect, parseQuery } from '@/util/utils';
import LevelSelect from '@/components/level-select';

function getColumns(scope) {
    return [
        {
            title: '用户ID',
            dataIndex: 'id'
        }, {
            title: '昵称',
            dataIndex: 'nickName'
        }, {
            title: '姓名',
            dataIndex: 'userName'
        }, {
            title: '手机号',
            dataIndex: 'phone'
        }, {
            title: '等级',
            dataIndex: 'memberTypeDO.value'
        }
    ];
}

let currentMemberType = '';

@connect(state => ({
    data: state['user.userinfo'].recommenderConfig,
    loading: state.loading.effects['user.userinfo'].getRecommend
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
    
    onTypeChange = memberType => {
        const params = {
            memberType
        }
        this.handleSearch(params);
        currentMemberType = memberType;
    }

    handleSearch = (params = {}) => {
        const { dispatch, history } = this.props;
        const obj = parseQuery(history);
        const payload = {
            memberId: obj.memberId,
            memberType: params.memberType || params.memberType === '' ? params.memberType : currentMemberType,
            page: params.page || 1,
            pageSize: params.pageSize || 10,
        };
        dispatch['user.userinfo'].getRecommend(payload);
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
        currentMemberType = ''
    }
    render() {
        const { data, loading } = this.props;
        return (
            <Card
                title="推荐的人"
            >
                <Row>
                    <Col style={{ marginBottom: 20 }}>
                        <span>等级：</span>
                        <LevelSelect 
                            onChange={this.onTypeChange}
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
                                current: data.current,
                            }}
                            onChange={this.onChange}
                            rowKey={record => record.id}
                            loading={loading}
                        />
                    </Col>
                </Row>
            </Card>
        );
    }
}