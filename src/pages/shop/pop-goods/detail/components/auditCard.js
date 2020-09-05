import React from 'react';
import { Card, Form, Radio, Input, Button } from 'antd';
import { connect } from '@/util/utils';
import WrapCard from './wrapCard'

const FormItem = Form.Item
const { TextArea } = Input;

const channelEnum = {
  1: '优选',
  2: '好店'
}

@connect()
@Form.create()
class AuditCard extends React.Component {
  handleSave = () => {
    const { dispatch, form, productPoolId } = this.props;
    form.validateFields(async (errors, values) => {
      if (errors) return;
      dispatch['shop.pop.goods.detail'].auditGoods({
        ...values,
        productPoolId
      })
    });
  }

  render() {
    const { data, form: { getFieldDecorator, getFieldValue } } = this.props

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
    };

    const tailLayout = {
      wrapperCol: { offset: 2, span: 16 },
    };

    return (
      <WrapCard
        data={data}
        render={({ status, auditStatus, auditInfo, channel }) => {
          // status 1: 上架 0 下架
          // auditStatus 商品审核 0: 待提交 1: 待审核 2: 审核通过 3: 审核不通过
          if (auditStatus === 0) { return null }

          if (status === 0 && auditStatus === 1) {
            return (
              <Card title='审核信息'>
                <Form {...formItemLayout}>
                  <FormItem label="渠道选择" required>
                    {getFieldDecorator('channel', {
                      rules: [
                        {
                          required: true,
                          message: '请选择渠道'
                        }
                      ]
                    })(
                      <Radio.Group>
                        <Radio value={1}>优选</Radio>
                        <Radio value={2}>好店</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                  <FormItem label="审核结果" required>
                    {getFieldDecorator('auditStatus', {
                      rules: [
                        {
                          required: true,
                          message: '请选择审核结果'
                        }
                      ]
                    })(
                      <Radio.Group>
                        <Radio value={2}>通过</Radio>
                        <Radio value={3}>不通过</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                  <FormItem label="审核说明">
                    {getFieldDecorator('auditInfo', {
                      rules: [
                        {
                          validator: (rule, value = '', callback) => {
                            if (getFieldValue('auditStatus') === 3 && !value.trim()) {
                              callback('请输入审核说明');
                            } else {
                              callback();
                            }
                          }
                        }
                      ]
                    })(
                      <TextArea
                        placeholder="请输入审核说明"
                        maxLength={255}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                      />
                    )}
                  </FormItem>
                  <FormItem {...tailLayout}>
                    <Button
                      type="primary"
                      onClick={this.handleSave}
                    >
                      审核
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            )
          }

          let auditResult = ''

          if (auditStatus === 2) {
            auditResult = '通过'
          } else if (auditStatus === 3) {
            auditResult = '不通过'
          } else {
            auditResult = '状态错误'
          }

          return (
            <Card title='审核信息'>
              <Form {...formItemLayout}>
              <FormItem label="渠道选择">
                  <span className="ant-form-text">
                    {channelEnum[channel]}
                  </span>
                </FormItem>
                <FormItem label="审核结果">
                  <span className="ant-form-text">
                    {auditResult}
                  </span>
                </FormItem>
                <FormItem label="审核说明">
                  <span className="ant-form-text">
                    {
                      auditInfo || '暂无说明'
                    }
                  </span>
                </FormItem>
              </Form>
            </Card>
          )
        }}
      />
    )
  }
}

export default AuditCard