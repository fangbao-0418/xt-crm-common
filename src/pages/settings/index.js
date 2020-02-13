import React, { Component, useState, useEffect } from 'react';
import { Form, Input, Button, Message, Row, Col } from 'antd';
import * as LocalStorage from '@/util/localstorage';
import { connect } from '@/util/utils';

const namespace = 'settings';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

const VerificationCode = ({ onChange, placeholder, maxLength, onClick }) => {
  const [disabled, setDisabled] = useState(false);
  const [countDownNum, setCountDownNum] = useState(0);

  const codeChange = e => {
    const { value } = e.target;
    onChange(value);
  };

  const countDown = () => {
    setTimeout(() => {
      setCountDownNum(countDownNum - 1);
    }, 1000);
  };

  const sendCode = () => {
    setDisabled(true);
    setCountDownNum(60);
    onClick();
  };

  useEffect(() => {
    if (countDownNum > 0) {
      countDown();
    } else {
      setDisabled(false);
    }
  }, [countDownNum]);

  return (
    <div>
      <Input
        style={{ width: 140, marginRight: 8 }}
        maxLength={maxLength}
        onChange={codeChange}
        placeholder={placeholder}
      />
      <Button type="primary" onClick={sendCode} disabled={disabled} style={{ width: 102 }}>
        {countDownNum === 0 ? '发送验证码' : `${countDownNum}S`}
      </Button>
    </div>
  );
};

@connect(state => ({}))
@Form.create()
export default class extends Component {
  constructor(props) {
    super(props);
    const user = LocalStorage.get('user');
    this.state = {
      user
    };
  }

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { user } = this.state;
    return (
      <Form {...formItemLayout} style={{ width: 800 }}>
        <FormItem label="姓名">{user.realname}</FormItem>
        <FormItem label="账号">{user.username}</FormItem>
        <FormItem label="密码" extra={'支持英文、数字、“_”“*”“?”“/”等特殊符号，最长支持16位'}>
          {getFieldDecorator('password', {
            rules: [
              {
                message: '请输入密码',
                required: true
              },
              {
                min: 6,
                message: '密码最小长度6位'
              }
            ]
          })(<Input.Password style={{ width: 250 }} maxLength="16" placeholder="请输入密码" />)}
        </FormItem>
        <FormItem label="确认密码" extra="请与密码保持一致">
          {getFieldDecorator('repassword', {
            rules: [
              {
                required: true,
                message: '请输入确认密码'
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input.Password style={{ width: 250 }} maxLength="16" placeholder="请输入确认密码" />)}
        </FormItem>
        <FormItem label="验证码">
          {getFieldDecorator('code', {
            rules: [
              {
                message: '请输入验证码',
                required: true
              }
            ]
          })(<VerificationCode onClick={this.sendCode} maxLength={6} placeholder="请输入验证码" />)}
        </FormItem>
        <Row>
          <Col span={6}></Col>
          <Col span={18}>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('和密码不一致，请重新输入');
    } else {
      callback();
    }
  };

  sendCode = () => {
    const { dispatch } = this.props;
    dispatch[namespace].sendCode();
  };

  handleSubmit = () => {
    const {
      form: { validateFields },
      dispatch
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        const { user } = this.state;
        const { password, code } = values;
        dispatch[namespace].changePassword({
          userID: user.id,
          password,
          code
        });
      }
    });
  };
}
