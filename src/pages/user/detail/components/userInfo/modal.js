import React, { Component } from 'react';
import { Modal, Form, Input, Col, Row, Select } from 'antd';
import { connect, parseQuery } from '@/util/utils';
import { MemberTypeTextMap } from '../../../../order/constant'
import styles from './index.module.scss';
import moment from 'moment';
const FormItem = Form.Item;
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
const { Search } = Input;
const memberTypes = [];
for (const key in MemberTypeTextMap) {
  memberTypes.push({
    key: parseInt(key),
    val: MemberTypeTextMap[key]
  })
}

@connect(state => ({
  currentData: state['user.userinfo'].currentData,
  inviteInfo: state['user.userinfo'].inviteInfo,
  visible: state['user.userinfo'].visible,
}))
@Form.create()
export default class extends Component {

  constructor(props) {
    super(props);
    console.log('props', props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentData.id) {
      console.log('nextProps', nextProps)
    }
    console.log(this.parentPhone != nextProps.inviteInfo.parentPhone)
    if (nextProps.inviteInfo.parentPhone && this.parentPhone != nextProps.inviteInfo.parentPhone) {
      const { form } = this.props;
      this.parentPhone = nextProps.inviteInfo.parentPhone;
      form.setFieldsValue({parentPhone:this.parentPhone})
      
    }
  }

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
    this.parentPhone = '';
    this.props.dispatch({
      type: 'user.userinfo/saveDefault',
      payload: {
        visible: false,
        inviteInfo: {}
      }
    })
  }
  renderHeadImage = (data) => {
    if (data.headImage) {
      const src = data.headImage.indexOf('http') === 0 ? `${data.headImage}` : `https://assets.hzxituan.com/${data.headImage}`;
      return <img alt="头像" src={src} style={{ width: '25px', borderRadius: '50%' }} />
    } else {
      return '暂无'
    }
  }

  search(value) {
    const { dispatch } = this.props;
    dispatch['user.userinfo'].checkInvited({
      phone: value
    });
  }

  renderForm = () => {
    const { form: { getFieldDecorator }, currentData } = this.props;
    let memberType = 0;
    if (currentData.id) {
      memberType = currentData.memberTypeDO.key
    }
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form layout="horizontal" {...formItemLayout} className={styles['user-edit-box']}>
        <Row>
          <Col span={24}>基本信息</Col>
          <Col span={12}>
            <Form.Item label="用户ID"><span className="ant-form-text">{currentData.id}</span></Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="头像">{this.renderHeadImage(currentData)}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="用户名">{currentData.nickName || '暂无'}</Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="注册时间">{currentData.createTime ? moment(currentData.createTime).format(timeFormat) : ''}</Form.Item>
          </Col>
          <Col span={12}>
            <FormItem label="手机号">
              {
                getFieldDecorator('phone', {
                  initialValue: currentData.phone
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="等级">
              {
                getFieldDecorator('memberType', {
                  initialValue: memberType
                })(
                  <Select>
                    {memberTypes.map(val => {
                      return <Select.Option value={val.key} key={val.key}>{val.val}</Select.Option>
                    })}
                  </Select>
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="微信">
              {
                getFieldDecorator('wechat', {
                  initialValue: currentData.wechat
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <Form.Item label="注册来源">{currentData.createTime ? moment(currentData.createTime).format(timeFormat) : ''}</Form.Item>
          </Col>
          <Col span={24}>团队信息</Col>
          <Col span={12}>
            <FormItem label="上级手机">
              {
                getFieldDecorator('parentPhone', {
                  initialValue: currentData.parentPhone
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="邀请人手机">
              {
                getFieldDecorator('invitedPhone', {
                  initialValue: currentData.invitedPhone
                })(
                  // <Input />
                  <Search
                    enterButton="校验"
                    onSearch={value => this.search(value)}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>基本信息</Col>
          <Col span={12}>
            <FormItem label="姓名">
              {
                getFieldDecorator('userName', {
                  initialValue: currentData.userName
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="身份证号">
              {
                getFieldDecorator('idCard', {
                  initialValue: currentData.idCard
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
  render() {
    const { visible } = this.props;
    return (
      <Modal
        title="用户信息"
        visible={visible}
        width={800}
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