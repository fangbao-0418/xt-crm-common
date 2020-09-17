/** 修改邀请人 */
import React, { Component } from 'react';
import { Modal, Form, Input, Col, Row, Select } from 'antd';
import { connect } from '@/util/utils';
import { MemberTypeTextMap } from '../../../../order/constant'
import styles from './index.module.scss';
import memberType from '@/enum/memberType';
const FormItem = Form.Item;
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
  visible: state['user.userinfo'].visibleInvit,
  tab: state['user.userinfo'].memberType
}))
@Form.create()
export default class extends Component {

  onOk = () => {
    const { dispatch, currentData, inviteInfo } = this.props;
    if (!inviteInfo.id) return;
    dispatch['user.userinfo'].updateInviteUser({
      memberId: currentData.id,
      invitedId: inviteInfo.id,
      tab: this.props.tab
    });
  }

  onCancel = () => {
    this.parentPhone = '';
    this.props.dispatch({
      type: 'user.userinfo/saveDefault',
      payload: {
        visibleInvit: false,
        inviteInfo: {}
      }
    })
  }

  search(value) {
    const { dispatch } = this.props;
    dispatch['user.userinfo'].checkInvited({
      phone: value
    });
  }

  renderForm = () => {
    const { currentData, inviteInfo } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form layout="horizontal" {...formItemLayout} className={styles['user-edit-box']}>
        <Row>
          <Col span={12}>
            <FormItem label="邀请人ID">
              {currentData.inviteId}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="手机">
              {currentData.invitedPhone}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="姓名">
              {currentData.inviteName}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="用户等级">
            {currentData.memberTypeDO && currentData.memberTypeDO.value}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="邀请人手机">
              <Search
                enterButton="校验"
                onSearch={value => this.search(value)}
              />
            </FormItem>
          </Col>
          {inviteInfo.id ? (<Col span={24}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;邀请人ID: {inviteInfo.id}&nbsp;&nbsp;&nbsp;
            手机：{inviteInfo.phone}&nbsp;&nbsp;&nbsp;
            用户名：{inviteInfo.userName}&nbsp;&nbsp;&nbsp;
            昵称：{inviteInfo.nickName}&nbsp;&nbsp;&nbsp;
            用户等级：{memberType.getValue(inviteInfo.memberType)}
          </Col>) : ''}
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