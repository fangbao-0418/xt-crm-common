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
  visible: state['user.userinfo'].visiblePhone,
}))
@Form.create()
export default class extends Component {

  onOk = () => {
    const { dispatch, currentData, inviteInfo } = this.props;
    console.log(this.phone)
    if (!this.phone) return;
    dispatch['user.userinfo'].exchangePhone({
      memberId: currentData.id,
      phone: this.phone
    });
  }

  onCancel = () => {
    this.parentPhone = '';
    this.props.dispatch({
      type: 'user.userinfo/saveDefault',
      payload: {
        visiblePhone: false,
        inviteInfo: {}
      }
    })
  }

  search = (value) => {
    const { dispatch } = this.props;
    dispatch['user.userinfo'].checkInvited({
      phone: value
    });
  }

  renderForm = () => {
    const { inviteInfo } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form layout="horizontal" {...formItemLayout} className={styles['user-edit-box']}>
        <Row>
          <Col span={12}>
            <FormItem label="手机">
              <Search
                enterButton="校验"
                onChange={(event) => {
                  this.phone = event.target.value
                }}
                onSearch={value => this.search(value)}
              />
            </FormItem>
          </Col>
          {inviteInfo.id ? (<Col span={24}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID: {inviteInfo.id}&nbsp;&nbsp;&nbsp;
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
    console.log('visible', visible)
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