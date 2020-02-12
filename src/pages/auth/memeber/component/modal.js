import React, { Component } from 'react';
import { Input, Form, Modal, Radio } from 'antd';
import { connect } from '@/util/utils';
import * as LocalStorage from '@/util/localstorage';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    sm: { span: 4 }
  },
  wrapperCol: {
    sm: { span: 16 }
  }
};

@connect(state => ({
  visible: state['auth.member'].visible,
  roleConfig: state['auth.member'].roleConfig,
  currentUserInfo: state['auth.member'].currentUserInfo
}))
@Form.create()
export default class extends Component {
  onCancel = () => {
    this.props.dispatch({
      type: 'auth.member/saveDefault',
      payload: {
        visible: false
      }
    });
  };

  onOk = () => {
    const {
      form: { validateFields },
      dispatch,
      currentUserInfo = {}
    } = this.props;
    validateFields((errors, values) => {
      if (!errors) {
        const { roleId, ...base } = values;
        const payload = {
          ...base
        };
        if (currentUserInfo.id) {
          // 编辑
          dispatch['auth.member'].editUser(
            {
              id: currentUserInfo.id,
              ...payload
            },
            { roleId }
          );
        } else {
          // 新增
          dispatch['auth.member'].addUser(base, { roleId });
        }
        this.onCancel();
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentUserInfo
    } = this.props;
    const user = LocalStorage.get('user') || {};
    return (
      <Modal visible={this.props.visible} onCancel={this.onCancel} onOk={this.onOk} destroyOnClose>
        <Form {...formItemLayout}>
          <FormItem label="真实姓名">
            {getFieldDecorator('realname', {
              initialValue: currentUserInfo.realname,
              rules: [
                {
                  required: true,
                  message: '姓名必填'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="账号">
            {getFieldDecorator('username', {
              initialValue: currentUserInfo.username,
              rules: [
                {
                  required: true,
                  message: '账号必填'
                }
              ]
            })(<Input />)}
          </FormItem>
          {!currentUserInfo.id || currentUserInfo.id === user.id || user.id === 1 ? (
            <FormItem label="密码">
              {getFieldDecorator('password', {
                initialValue: currentUserInfo.password
              })(<Input />)}
            </FormItem>
          ) : null}
          <FormItem label="手机号">
            {getFieldDecorator('phone', {
              initialValue: currentUserInfo.phone,
              rules: [
                {
                  required: true,
                  message: '手机号必填'
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="状态">
            {getFieldDecorator('status', {
              initialValue: currentUserInfo.status
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
