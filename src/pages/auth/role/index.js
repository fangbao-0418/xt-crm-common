import React, { Component } from 'react';
import { Input, Button, Row, Col, Form } from 'antd';
import moment from 'moment';
import { connect } from '@/util/utils';
import CommonTable from '@/components/common-table';
import Modal from './modal';

const FormItem = Form.Item;


function getColumns(scope) {
    const columns = [
        {
            title: '角色名称',
            dataIndex: 'roleName'
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            render(v) {
                return moment(v).format('YYYY-MM-DD HH:mm:ss')
            }
        }, {
            title: '创建人',
            dataIndex: 'createUserName'
        }, {
            title: '操作',
            render(_, record) {
                return <a onClick={() => scope.onEdit(record)}>编辑</a>
            }
        }
    ];
    return columns;
}

@connect(state => ({
    roleConfig: state['auth.role'].roleConfig
}))
@Form.create()
export default class extends Component {

    componentDidMount() {
        this.handleSearch()
    }

    onShowModal = (currentRoleInfo = {}) => {
        const { dispatch } = this.props;
        dispatch['auth.role'].saveDefault({
            visible: true,
            currentRoleInfo
        });
    }

    onEdit = (item) => {
        const { dispatch } = this.props;
        dispatch['auth.role'].getRoleInfo(item, (currentRoleInfo) => {
            this.onShowModal(currentRoleInfo)
        });
    }


    handleSearch = (params = {}) => {
        const { form: { validateFields }, dispatch } = this.props;

        validateFields((errors, values) => {
            if (!errors) {
                const payload = {
                    page: params.page || 1,
                    pageSize: params.pageSize || 10,
                    ...values,
                };
                dispatch['auth.role'].getRoleList(payload)
            }
        });
    }

    renderForm = () => {
        const { form: { getFieldDecorator } } = this.props;
        return (
            <Form layout="inline">
                <FormItem label="角色名称">
                    {
                        getFieldDecorator('roleName')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.handleSearch}>查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={() => this.onShowModal()}>添加角色</Button>
                </FormItem>
            </Form>
        )
    }
    render() {
        const { roleConfig = {} } = this.props;
        return (
            <Row>
                <Col style={{ marginBottom: 10 }}>
                    {this.renderForm()}
                </Col>
                <Col>
                    <CommonTable
                        columns={getColumns(this)}
                        dataSource={roleConfig.records || []}
                        onChange={this.handleSearch}
                        total={roleConfig.total}
                        current={roleConfig.current}
                        rowKey={record => record.id}
                    />
                </Col>
                <Modal />
            </Row>
        )
    }
}