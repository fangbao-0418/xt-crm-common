import React from 'react'
import { Card, Form, Input, Button, Checkbox, InputNumber, Row, Col, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { RouteComponentProps } from 'react-router'
import ProductCategory from '../components/product-category'
import BlacklistModal from '../components/blacklist-modal'
import { refundAutoAdd, refundAutoUpdate, refundAutoDetail } from '../api'

const FormItem = Form.Item

interface Props extends RouteComponentProps<{ id: string }>, FormComponentProps {}

class Main extends React.Component<Props> {
  blacklistModal: any
  id = this.props.match.params.id
  componentDidMount () {
    if (!this.id) {
      return
    }
    refundAutoDetail(this.id).then((res: any) => {
      this.props.form.setFieldsValue({
        disposeName: res.disposeName,
        refundTypeS: res.refundTypeS,
        levelIds: [
          {
            value: res.oneLevelId,
            label: res.oneLevelName
          },
          {
            value: res.twoLevelId,
            label: res.twoLevelName
          },
          {
            value: res.threeLevelId,
            label: res.threeLevelName
          }
        ],
        memberTypeS: res.memberTypeS,
        refundMoney: res.refundMoney / 100
      })
    })
  }

  handleSubmit = (e: any) => {
    e.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll((err, { levelIds, refundMoney, ...values }) => {
      if (err) {
        return
      }
      const params = {
        ...values,
        refundMoney: refundMoney * 10 * 10,
        oneLevelId: levelIds[0].value,
        oneLevelName: levelIds[0].label,
        twoLevelId: levelIds[1].value,
        twoLevelName: levelIds[1].label,
        threeLevelId: levelIds[2].value,
        threeLevelName: levelIds[2].label,
        blackListProductIdS: this.blacklistModal.state.productIds.map((item: any) => item.val)
      }
      let fn
      if (this.id) {
        params.serialNo = this.id
        fn = refundAutoUpdate
      } else {
        fn = refundAutoAdd
      }
      fn(params).then(() => {
        APP.success('添加成功')
      })
    })
  }

  handleBlack = () => {
    const {
      form: { getFieldValue }
    } = this.props
    const levelIds = getFieldValue('levelIds')
    if (levelIds?.length) {
      this.blacklistModal.show()
    } else {
      Modal.warning({
        title: '提示',
        content: '请选择类目'
      })
    }
  }

  render () {
    const {
      form: { getFieldDecorator, getFieldValue }
    } = this.props

    const levelIds = getFieldValue('levelIds')

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      }
    }

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 4 }
      }
    }

    return (
      <Card
        title='新增配置'
        bordered={false}
      >
        <BlacklistModal levelIds={levelIds} wrappedComponentRef={(ref: any) => this.blacklistModal = ref} />
        <Form
          onSubmit={this.handleSubmit}
        >
          <FormItem {...formItemLayout} label='配置名称'>
            {getFieldDecorator('disposeName', {
              rules: [
                {
                  required: true,
                  message: '请输入'
                }
              ]
            })(
              <Input
                placeholder='请输入'
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='售后类型选择'>
            {getFieldDecorator('refundTypeS', {
              rules: [
                {
                  required: true,
                  message: '请输入'
                }
              ]
            })(
              <Checkbox.Group
                options={[
                  { label: '全选', value: '' },
                  { label: '退货退款', value: 10 },
                  { label: '换货', value: 30 }
                ]}
              />
            )}
          </FormItem>
          <FormItem
            label='类目选择'
            {...{
              labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
              }
            }}
          >
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('levelIds', {
                  rules: [
                    {
                      required: true,
                      message: '请选择'
                    }
                  ]
                })(
                  <ProductCategory
                    labelInValue
                  />
                )}
              </Col>
              <Col span={12}>
                <Button
                  type='link'
                  onClick={this.handleBlack}
                  style={{ color: levelIds?.length ? '#40a9ff' : '#999999' }}
                >
                  商品黑名单设置
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem
            {...{
              labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
              }
            }}
            label='会员等级'
          >
            {getFieldDecorator('memberTypeS', {
              rules: [
                {
                  required: true,
                  message: '请选择'
                }
              ]
            })(
              <Checkbox.Group
                options={[
                  { label: '全选', value: '' },
                  { label: '普通会员', value: 0 },
                  { label: '团长', value: 10 },
                  { label: '社区管理员', value: 20 },
                  { label: '城市合伙人', value: 30 },
                  { label: '管理员', value: 40 }
                ]}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='金额配置'>
            {getFieldDecorator('refundMoney', {
              rules: [
                {
                  required: true,
                  message: '请输入'
                }
              ]
            })(
              <InputNumber
                placeholder='请输入'
              />
            )}
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button
              type='primary'
              htmlType='submit'
            >
              保存
            </Button>
            <Button
              style={{ marginLeft: 16 }}
              onClick={() => {
                APP.history.push('/order/autoRefundRule')
              }}
            >
              取消
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(Main)