import React, { Component, Fragment } from 'react';
import { Modal, Form, Radio, InputNumber, Checkbox, Row, Col } from 'antd';
import { connect } from '@/util/utils';
import styles from '../index.module.scss';

const FormItem = Form.Item;

@connect(state => ({
  modal: state['shop.commission'].configModal,
  currentCategory: state['shop.commission'].currentCategory
}))
@Form.create()
export default class ConfigModal extends Component {
  /** 确定操作 */
  handleOk = () => {
    const { form: { validateFields }, dispatch } = this.props
    validateFields((err, values) => {
      if (err) return;
      dispatch['shop.commission'].updateCategory(values);
    });
  }

  /** 取消操作 */
  handleCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop.commission/saveDefault',
      payload: {
        configModal: {
          visible: false
        }
      }
    })
  }

  /** 窗口彻底关闭回调 */
  handleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop.commission/saveDefault',
      payload: {
        currentCategory: null
      }
    })
  }

  render() {
    const { form: { getFieldDecorator }, modal, currentCategory } = this.props;

    if (!currentCategory) return null;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }

    const formTailLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 11,
        offset: 5,
      },
    };

    return (
      <Modal
        title={`当前类目 【${currentCategory.name}】 设置佣金`}
        visible={modal.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
      >
        {
          currentCategory.parentId !== 0 ? <Fragment>
            <FormItem {...formItemLayout} label="父类目">
              <span>{currentCategory.parentName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="父类目佣金">
              <Row>
                <Col span={8}>
                  <span className={styles.icon}>代</span>
                  20%
              </Col>
                <Col span={8}>
                  <span className={styles.icon}>公</span>
                  20%
              </Col>
              </Row>
            </FormItem>
          </Fragment> : null
        }
        <FormItem {...formItemLayout} label="类目名称">
      <span>{currentCategory.name}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="佣金类型">
          {getFieldDecorator('commissionType', {
            rules: [
              {
                required: true,
                message: '请选择佣金类型！'
              }
            ],
          })(<Radio.Group>
            <Radio value="1">继承父类目</Radio>
            <Radio value="2">独立设置</Radio>
          </Radio.Group>)}
        </FormItem>
        <FormItem {...formItemLayout} label="代理佣金">
          {getFieldDecorator('agentCommission', {
            rules: [
              {
                required: true,
                message: '请输入代理佣金！'
              }
            ],
          })(<InputNumber style={{ width: 120 }} placeholder='请输入' min={1} max={10} />)}
          <span>{' %'}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="公司佣金">
          {getFieldDecorator('companyCommission', {
            rules: [
              {
                required: true,
                message: '请输入公司佣金！'
              }
            ],
          })(<InputNumber style={{ width: 120 }} placeholder='请输入' min={0} max={10} />)}
          <span>{' %'}</span>
        </FormItem>
        <FormItem {...formTailLayout}>
          {getFieldDecorator('cover')(<Checkbox>覆盖所有子类目</Checkbox>)}
        </FormItem>
      </Modal>
    )
  }
}