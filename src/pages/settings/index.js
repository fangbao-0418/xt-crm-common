import React, { Component } from 'react';
import { Form, Input, Button, Message } from 'antd';
import * as LocalStorage from '@/util/localstorage';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
};

@Form.create()
export default class extends Component {

    constructor(props) {
        super(props);
        const user = LocalStorage.get('user');
        this.state = {
            user
        }
    }

    handleSearch = () => {
        const { form: { validateFields }, dispatch } = this.props;
        validateFields((errors, values) => {
            if (!errors) {
                if (values.password !== values.repassword) {
                    return Message.error('密码不一致，请重新输入')
                }
            }
        })
    }

    render() {
        const { form: { getFieldDecorator, resetFields, getFieldValue } } = this.props;
        const { user } = this.state;
        const repassword = getFieldValue('repassword');
        return (
            <Form layout="vertical" {...formItemLayout} style={{ width: '50%', margin: '50px auto' }}>
                <FormItem label="姓名">
                    {
                        getFieldDecorator('realname', {
                            initialValue: user.realname
                        })(
                            <Input disabled/>
                        )
                    }
                </FormItem>
                <FormItem label="账号">
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username
                        })(
                            <Input disabled />
                        )
                    }
                </FormItem>
                <FormItem label="密码">
                    {
                        getFieldDecorator('password', {
                            rules: [{
                                
                                message: '输入密码',
                                required: true
                            }],
                            onChange: () => repassword && resetFields(['repassword'])
                        })(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem label="重复密码">
                    {
                        getFieldDecorator('repassword')(
                            <Input />
                        )
                    }
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={this.handleSearch}>提交</Button>
                </FormItem>
            </Form>
        )
    }
}