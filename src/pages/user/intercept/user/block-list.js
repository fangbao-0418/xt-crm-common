import React from 'react';
import { Table, Form, Divider, Input, Button, Modal } from 'antd';
import { getUserList } from './api';
import { omitBy, isNil, concat, difference } from 'lodash';

const FormItem = Form.Item;

@Form.create()
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            addList: props.idsByLevel.addIds || [],
            delList: props.idsByLevel.delIds || []
        }
    }

    componentDidMount() {
        this.handleSearch();
    }

    handleSearch = (param = {}) => {
        const { level } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const payload = omitBy({
                    ...values,
                    memberType: level,
                    page: param.current || 1,
                    pageSize: param.pageSize || 10
                }, (val) => (val === '' || isNil(val)));
                getUserList(payload).then((res) => {
                    console.log(res);
                    this.setState({
                        dataSource: res
                    })
                });
            }
        })
    }

    render() {
        const columns = [
            {
                title: '用户ID',
                dataIndex: 'id'
            }, {
                title: '昵称',
                dataIndex: 'nickName'
            }, {
                title: '手机号',
                dataIndex: 'phone'
            }, {
                title: '等级',
                dataIndex: 'memberTypeDesc'
            }, {
                title: '拦截权限',
                dataIndex: 'orderInterceptionDesc'
            }
        ];
        const { level, blockList, visible, onCancel } = this.props;
        const { dataSource, addList, delList } = this.state;
        const selectedRowKeys = difference(concat(blockList.checkedMemberIds || [], addList), delList);
        const rowSelection = {
            selectedRowKeys,
            onSelect: (record, selected) => {
                if (selected) {
                    if ((blockList.checkedMemberIds || []).includes(record.id)) {
                        this.setState({
                            delList: difference(delList, [record.id])
                        })
                    } else {
                        this.setState({
                            addList: concat(addList, [record.id])
                        })
                    }
                } else {
                    if ((blockList.checkedMemberIds || []).includes(record.id)) {
                        this.setState({
                            delList: concat(delList, [record.id])
                        })
                    } else {
                        this.setState({
                            addList: difference(delList, [record.id])
                        })
                    }
                }
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                let tempDelList = [], tempAddList = [];
                if (selected) {
                    changeRows.map(item => {
                        if ((blockList.checkedMemberIds || []).includes(item.id)) {
                            tempDelList = difference(tempDelList, [item.id])
                        } else {
                            tempAddList = concat(tempAddList, [item.id]);
                        }
                    })
                } else {
                    changeRows.map(item => {
                        if ((blockList.checkedMemberIds || []).includes(item.id)) {
                            tempDelList = concat(tempDelList, [item.id])
                        } else {
                            tempAddList = difference(tempDelList, [item.id])
                        }
                    })
                }
                this.setState({
                    addList: tempAddList,
                    delList: tempDelList
                })
            }
        };
        return <Modal
            title={"黑名单设置"}
            visible={visible}
            width='1200px'
            style={{ fontSize: 20, fontWeight: 'bold' }}
            onCancel={onCancel}
            onOk={this.onOk}
        >
            {this.renderForm(level)}
            <Table
                size="middle"
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={(dataSource && dataSource.records) || []}
                rowSelection={rowSelection}
                pagination={{
                    current: dataSource['current'] || 1,
                    pageSize: dataSource['size'] || 10,
                    total: dataSource['total'],
                    showQuickJumper: true,
                    showSizeChanger: true,
                    size: "small"
                }}
                onChange={(pagination) => { this.handleSearch(pagination) }}
            />
        </Modal>
    }


    renderForm = (level) => {
        const { form: { getFieldDecorator } } = this.props;
        return (
            <Form layout="inline">
                <FormItem label='用户ID'>
                    {
                        getFieldDecorator('id')(
                            <Input placeholder="请输入ID" style={{ width: 120 }} />
                        )
                    }
                </FormItem>

                <FormItem label="昵称">
                    {
                        getFieldDecorator('nickNameLike')(
                            <Input placeholder="请输入昵称" style={{ width: 120 }} />
                        )
                    }
                </FormItem>


                <FormItem label="姓名">
                    {
                        getFieldDecorator('userName')(
                            <Input placeholder="请输入姓名" style={{ width: 120 }} />
                        )
                    }
                </FormItem>
                <FormItem label="手机号">
                    {
                        getFieldDecorator('phone')(
                            <Input placeholder="请输入手机号" style={{ width: 120 }} />
                        )
                    }
                </FormItem>
                <FormItem label="等级">
                    {level === 10 ? '团长' : level === 20 ? '社区管理员' : '城市合伙人'}
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.handleSearch}>查询</Button>
                    <Button onClick={() => { this.props.form.resetFields() }} style={{ marginLeft: 8 }}>清除条件</Button>
                </FormItem>
            </Form>
        )
    }

    onOk = () => {
        const { addList, delList } = this.state;
        const { level } = this.props;
        this.props.onOk({ addIds: addList, delIds: delList, level })
    }
}