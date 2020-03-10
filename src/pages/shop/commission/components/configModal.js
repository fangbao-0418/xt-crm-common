import React, { Component, Fragment } from 'react';
import { Modal, Form, Radio, InputNumber, Checkbox, Row, Col } from 'antd';
import If from '@/packages/common/components/if';
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
    const { form: { getFieldDecorator, getFieldValue }, modal, currentCategory } = this.props;

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

    let rateType = getFieldValue('rateType') || currentCategory.currentCategory,
      agencyRate = currentCategory.agencyRate,
      companyRate = currentCategory.companyRate,
      isCoverChildCategory = currentCategory.isCoverChildCategory;

    return (
      <Modal
        title={`当前类目 【${currentCategory.name}】 设置佣金`}
        visible={modal.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
      >
        <If condition={currentCategory.parentCategoryId !== 0}>
          <FormItem {...formItemLayout} label="父类目">
            <span>{currentCategory.parentCategoryName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="父类目佣金">
            <Row>
              <Col span={8}>
                <span className={styles.icon}>代</span>
                {currentCategory.parentAgencyRate}
              </Col>
              <Col span={8}>
                <span className={styles.icon}>公</span>
                {currentCategory.parentCompanyRate}
              </Col>
            </Row>
          </FormItem>
        </If>
        <FormItem {...formItemLayout} label="类目名称">
          <span>{currentCategory.name}</span>
        </FormItem>
        <FormItem {...formItemLayout} label="佣金类型">
          {getFieldDecorator('rateType', {
            rules: [
              {
                required: true,
                message: '请选择佣金类型！'
              }
            ],
            initialValue: rateType
          })(<Radio.Group>
            <Radio value={1}>继承父类目</Radio>
            <Radio value={2}>独立设置</Radio>
          </Radio.Group>)}
        </FormItem>
        <If condition={rateType === 2}>
          <FormItem {...formItemLayout} label="代理佣金">
            {getFieldDecorator('agencyRate', {
              rules: [
                {
                  required: true,
                  message: '请输入代理佣金！'
                }
              ],
              initialValue: agencyRate
            })(<InputNumber style={{ width: 120 }} placeholder='请输入' min={1} max={10} />)}
            <span>{' %'}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="公司佣金">
            {getFieldDecorator('companyRate', {
              rules: [
                {
                  required: true,
                  message: '请输入公司佣金！'
                }
              ],
              initialValue: companyRate
            })(<InputNumber style={{ width: 120 }} placeholder='请输入' min={0} max={10} />)}
            <span>{' %'}</span>
          </FormItem>
          <FormItem {...formTailLayout}>
            {getFieldDecorator('isCoverChildCategory', {
              initialValue: isCoverChildCategory
            })(<Checkbox>覆盖所有子类目</Checkbox>)}
          </FormItem>
        </If>
      </Modal>
    )
  }
}