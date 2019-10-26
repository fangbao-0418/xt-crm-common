import React, { Component } from 'react';
import { connect, parseQuery, setQuery } from '@/util/utils';
import { Card, Row, Col, Form, Input, DatePicker, Select, Button, Divider, Table } from 'antd';
import { levelArr, sourceArr } from '../config';
import { levelName } from '../utils';
import styles from './index.module.scss';
import Modal from './modal';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const basePayload = {
    page: 1,
    pageSize: 10
};
const timeFormat = 'YYYY-MM-DD HH:mm:ss';

function getColumns(scope) {
    return [
        {
            title: '用户ID',
            dataIndex: 'id'
        }, {
            title: '头像',
            dataIndex: 'headImage',
            render(v) {
                const headImage = v && v.indexOf('http') === 0 ? `${v}` : `https://assets.hzxituan.com/${v}`;
                return v ? <img alt="头像" src={headImage} className={styles.headImage} /> : ''
            },
        }, {
            title: '昵称',
            dataIndex: 'nickName'
        }, {
            title: '手机号',
            dataIndex: 'phone'
        }, {
            title: '等级',
            dataIndex: 'memberLevel',
            render(v, rec) {
                return <span>{levelName({memberType:rec.memberTypeDO.key, memberTypeLevel:rec.memberTypeLevel})}</span>
            }
        }, {
            title: '邀请人手机号',
            dataIndex: 'invitePhone',
            render(v, rec) {
                return <span className={styles['detail-button']} onClick={() => scope.onInviteClick(rec)}>{v}</span>
            }
        },
        //  {
        //     title: '推荐人数',
        //     dataIndex: 'inviteMemberCount'
        // }, 
        {
            title: '个人销售额(¥)',
            dataIndex: 'money',
            render(v) {
                return <span>{v/100}</span>
            }
        },
        //  {
        //     title: '团队人数',
        //     dataIndex: 'count'
        // }, 
        {
            title: '团队销售额(¥)',
            dataIndex: 'countMoney',
            render(v) {
                return <span>{v/100}</span>
            }
        }, {
            title: '操作',
            render(_, record) {
                return (
                    <>
                        {
                            record.memberTypeDO.key >= 10 ? // 团长以上才可以发码
                            <>
                                <span className={styles['detail-button']} onClick={() => scope.onShowCodeModal(record)}>发码</span>
                                <Divider type="vertical" />
                            </> : ''
                        }
                        <span className={styles['detail-button']} onClick={scope.onDetail.bind(scope, record)}>详情</span>
                        {
                            record.haveChild ?
                            <>
                                <Divider type="vertical" />
                                <span className={styles['more-button']}  onClick={scope.onMore.bind(scope, record)}>查看下级</span>
                            </> : ''
                        }
                    </>
                )
            }
        },
    ]
}

let unlisten = null;

@connect(state => ({
    tableConfig: state['user.userlist'].tableConfig,
    loading: state.loading.effects['user.userlist'].getData,
}))
@Form.create()
export default class extends Component {


    componentDidMount() {
        unlisten = this.props.history.listen(() => {
            // const { form: { resetFields } } = this.props;
            const params = parseQuery(this.props.history);
            // resetFields();
            this.handleSearch(params);
        });
        this.handleSearch(basePayload);
    }

    onInviteClick = (item) => {
        const { history } = this.props;
        history.push(`/user/detail?memberId=${item.inviteId}`);
    }

    onMore = item => {
        const { form: { resetFields } } = this.props;
        const params = parseQuery(this.props.history);
        resetFields();
        if (item.id === +params.parentMemberId) {
            const random = Math.random();
            setQuery({ parentMemberId: item.id, random, ...basePayload }, true);
        } else {
            setQuery({ parentMemberId: item.id, ...basePayload }, true);
        }
        
    }

    onDetail = (item) => {
        const { history } = this.props;
        history.push(`/user/detail?memberId=${item.id}`);
    }

    handleSearch = (params = {}) => {
        const { form: { validateFields }, dispatch } = this.props;
        validateFields((errors, values) => {
            if (!errors) {
                const { time } = values;
                const payload = {
                    ...basePayload,
                    ...values,
                    registerStartDate: time && time[0] && time[0].format(timeFormat),
                    registerEndDate: time && time[1] && time[1].format(timeFormat),
                    time: undefined, // 覆盖values.time
                    ...params
                };
                if(payload.memberType.indexOf('-') > -1) {
                    const types = payload.memberType.split('-');
                    payload.memberType = types[0];
                    payload.memberTypeLevel = types[1];
                }
                dispatch['user.userlist'].getData(payload);
            }
        })
    }

    // onSearch = () => {
    //     const { form: { validateFields }, dispatch } = this.props;
    //     validateFields((errors, values) => {
    //         const { time } = values;
    //         const payload = {
    //             ...basePayload,
    //             ...values,
    //             registerStartDate: time && time[0] && time[0].format(timeFormat),
    //             registerEndDate: time && time[1] && time[1].format(timeFormat),
    //             time: undefined, // 覆盖values.time
    //         };
    //         setQuery(payload, true);
    //     })
    // }

    renderForm = () => {
        const { form: { getFieldDecorator, resetFields } } = this.props;
        return (
            <Form layout="inline">
                <FormItem label="用户ID">
                    {
                        getFieldDecorator('id', {
                            rules: [{
                                
                                message: '请输入数字类型',
                                pattern: /^[0-9]*$/
                            }]
                        })(
                            <Input type='number'/>
                        )
                    }
                </FormItem>
                <FormItem label="昵称">
                    {
                        getFieldDecorator('nickName')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="姓名">
                    {
                        getFieldDecorator('userName')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="注册时间">
                    {
                        getFieldDecorator('time')(
                            <RangePicker
                                showTime
                            />
                        )
                    }
                </FormItem>
                <FormItem label="等级" className={styles.level}>
                    {
                        getFieldDecorator('memberType', {
                            initialValue: ''
                        })(
                            <Select>
                                {
                                    levelArr.map(item => (<Option value={item.value} key={item.value}>{item.key}</Option>))
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="手机号">
                    {
                        getFieldDecorator('phone')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="邀请人手机号">
                    {
                        getFieldDecorator('invitePhone')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="注册来源" className={styles.source}>
                    {
                        getFieldDecorator('registerFrom', {
                            initialValue: ''
                        })(
                            <Select>
                                {
                                    sourceArr.map(item => (<Option value={item.value} key={item.value}>{item.key}</Option>))
                                }
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem>
                    <Button type="primary" style={{ marginRight: 10 }} onClick={() => this.handleSearch()}>查询</Button>
                    <Button type="primary" onClick={() => resetFields()}>清除条件</Button>
                </FormItem>
            </Form>
        )
    }

    onChange = (pageConfig) => {
        const params = {
            page: pageConfig.current,
            pageSize: pageConfig.pageSize
        };
        setQuery(params);
    }

    showTotal = total => {
        return <span>共{total}条数据</span>
    }

    onShowCodeModal = (item) => {
        this.props.dispatch({
            type: 'user.userlist/saveDefault',
            payload: {
                visible: true,
                currentUserInfo: item
            }
        })
    }

    componentWillUnmount() {
        unlisten();
    }

    render() {
        const { tableConfig, loading } = this.props;
        return (
            <>
                <Card>
                <Row>
                    <Col style={{ marginBottom: 20 }}>
                        {
                            this.renderForm()
                        }
                    </Col>
                    <Col>
                        <Table
                            dataSource={tableConfig.records}
                            columns={getColumns(this)}
                            pagination={{
                                total: tableConfig.total,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: this.showTotal,
                                current: tableConfig.current
                            }}
                            onChange={this.onChange}
                            rowKey={record => record.id}
                            loading={loading}
                        />
                    </Col>
                    <Modal />
                </Row>
            </Card>
            </>
        )
    }
}