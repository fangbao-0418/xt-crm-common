import React, { Component } from 'react';
import { Input, Form, Modal, Button } from 'antd';
import { connect } from '@/util/utils';
import styles from './index.module.scss'
import { namespace } from './model'
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
    visible: state[namespace].visible,
    excelDialogVisible: state[namespace].excelDialogVisible,
    currentUserInfo: state[namespace].currentUserInfo
}))
@Form.create()
export default class extends Component {
  onCancel = () => {
      this.props.dispatch({
          type: `${namespace}/saveDefault`,
          payload: {
              visible: false
          }
      })
  }

  onOk = () => {
      const { form: { validateFields }, dispatch, currentUserInfo } = this.props;
      validateFields((errors, values) => {
          if (!errors) {
              dispatch[namespace].sendCode({
                  memberId: currentUserInfo.id,
                  num: values.num
              });
          }
      });
  }
  /** 关闭批量开启excel弹窗 */
  closeExcel = () => {
    this.props.dispatch({
      type: `${namespace}/saveDefault`,
      payload: {
        excelDialogVisible: false
      }
    })
  }
  render() {
    const { form: { getFieldDecorator }, currentUserInfo } = this.props;
    return (
      <>
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
        <Modal
          visible={this.props.excelDialogVisible}
          title='批量开启权限、设置额度'
          footer={null}
          onCancel={this.closeExcel}
        >  
          <div>
            <span className='href mr10'>导入excel表</span>
            <span className={styles.download}>下载模板</span>
          </div>
          <div style={{marginTop: 30}}>
            <Button type='primary'>批量开启</Button>
          </div>
        </Modal>
      </>
    )
  }
}