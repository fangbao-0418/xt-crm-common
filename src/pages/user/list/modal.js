import React, { Component } from 'react';
import { Input, Form, Modal, InputNumber } from 'antd';
import { connect } from '@/util/utils';

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
      sm: { span: 4 },
    },
    wrapperCol: {
      sm: { span: 16 },
    },
  };

@connect(state => ({
    visible: state['user.userlist'].visible,
    currentUserInfo: state['user.userlist'].currentUserInfo
}))
@Form.create()
export default class extends Component {
    onCancel = () => {
        this.props.dispatch({
            type: 'user.userlist/saveDefault',
            payload: {
                visible: false
            }
        })
    }

    onOk = () => {
        const { form: { validateFields }, dispatch, currentUserInfo } = this.props;
        validateFields((errors, values) => {
            if (!errors) {
                dispatch['user.userlist'].sendCode({
                    memberId: currentUserInfo.id,
                    num: values.num
                });
            }
        });
    }

    render() {
        const { form: { getFieldDecorator }, currentUserInfo } = this.props;
        return (
            <Modal
                visible={this.props.visible}
                onCancel={this.onCancel}
                onOk={this.onOk}
                destroyOnClose
            >
                <Form {...formItemLayout}>
                    <FormItem label="会员名称">
                        {
                            getFieldDecorator('nickName', {
                                initialValue: currentUserInfo.nickName || '喜团会员'
                            })(
                                <Input disabled />
                            )
                        }
                    </FormItem>
                    <FormItem label="会员账号">
                        {
                            getFieldDecorator('phone', {
                                initialValue: currentUserInfo.phone
                            })(
                                <Input disabled />
                            )
                        }
                    </FormItem>

                    <FormItem label="会员等级">
                        {
                            getFieldDecorator('memberType', {
                                initialValue: currentUserInfo.memberTypeDO ? currentUserInfo.memberTypeDO.value : ''
                            })(
                                <Input disabled />
                            )
                        }
                    </FormItem>
                    <FormItem label="发码数量">
                        {
                            getFieldDecorator('num', {
                                initialValue: '',
                                rules:[{
                                    pattern: /^[1-9]\d{0,3}$/,
                                    message: '发码数量为1~9999'
                                }]
                            })(
                                <Input addonAfter="个" />
                            )
                        }
                    </FormItem>
                </Form>
            </Modal>
        )
    }
}