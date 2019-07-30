import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { connect, parseQuery } from '@/util/utils';
import styles from './index.module.scss';

const FormItem = Form.Item;

@connect(state => ({
    currentData: state['user.userinfo'].currentData,
    visible: state['user.userinfo'].visible,
}))
@Form.create()
export default class extends Component {

    onOk = () => {
        const { form: { validateFields }, dispatch, currentData } = this.props;
        validateFields((errors, values) => {
            const payload = {
                ...values,
                id: currentData.id
            };
            dispatch['user.userinfo'].updateUserInfo(payload);
        })
    }

    onCancel = () => {
        this.props.dispatch({
            type: 'user.userinfo/saveDefault',
            payload: {
                visible: false
            }
        })
    }

    renderForm = () => {
        const { form: { getFieldDecorator }, currentData } = this.props;
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        };
        return (
            <Form layout="horizontal" {...layout}>
                <FormItem label="用户名">
                    {
                        getFieldDecorator('nickName', {
                            initialValue: currentData.nickName
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="手机号">
                    {
                        getFieldDecorator('phone', {
                            initialValue: currentData.phone
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="微信">
                    {
                        getFieldDecorator('wechat', {
                            initialValue: currentData.wechat
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="姓名">
                    {
                        getFieldDecorator('userName', {
                            initialValue: currentData.userName
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="身份证号">
                    {
                        getFieldDecorator('idCard', {
                            initialValue: currentData.idCard
                        })(
                            <Input />
                        )
                    }
                </FormItem>
            </Form>
        )
    }
    render() {
        const { visible } = this.props;
        return (
            <Modal
               title="编辑"
               visible={visible}
               onCancel={this.onCancel}
               destroyOnClose
               onOk={this.onOk}
            >
                {
                    this.renderForm()
                }
            </Modal>
        );
    }
}