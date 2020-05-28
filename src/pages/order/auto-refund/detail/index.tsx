import React from 'react'
import { Card, Form, Input, Button, InputNumber, Row, Col, Modal, Tag, List } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { RouteComponentProps } from 'react-router'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import ProductCategory from '../components/product-category'
import BlacklistModal from '../components/blacklist-modal'
import XtCheckBox from '../components/xt-check-box'
import { StatusEnum, RefundTypeEnum, MemberTypeEnum } from '../config'
import { refundAutoAdd, refundAutoUpdate, refundAutoDetail } from '../api'
import { Detail } from '../interface'
import { formatMoneyWithSign } from '../../../helper'

const FormItem = Form.Item

interface Props extends RouteComponentProps<{ id: string }>, FormComponentProps, AlertComponentProps {}

interface State {
  detail: Detail
}

class Main extends React.Component<Props, State> {
  blacklistModal: any
  id = this.props.match.params.id
  state: State = {
    detail: null as any
  }
  componentDidMount () {
    if (!this.id) {
      return
    }
    refundAutoDetail(this.id).then((res: Detail) => {
      if (!res) {
        return
      }
      this.setState({
        detail: res
      }, () => {
        if (res.status === StatusEnum['待启用']) {
          const levelIds = [
            {
              value: res.oneLevelId,
              label: res.oneLevelName
            }
          ]

          if (res.twoLevelId) {
            levelIds[1] = {
              value: res.twoLevelId,
              label: res.twoLevelName
            }
          }

          if (res.threeLevelId) {
            levelIds[1] = {
              value: res.threeLevelId,
              label: res.threeLevelName
            }
          }
          this.props.form.setFieldsValue({
            disposeName: res.disposeName,
            refundTypeS: res.refundTypeS,
            levelIds,
            memberTypeS: res.memberTypeS,
            refundMoney: res.refundMoney / 100
          })

          if (res.blackListProductMsg && res.blackListProductMsg.length) {
            this.blacklistModal.setFieldsValue({
              productIds: res.blackListProductMsg.map((item: any) => item.productId).join('\n')
            })
          }
        }
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
        twoLevelId: levelIds[1]?.value,
        twoLevelName: levelIds[1]?.label,
        threeLevelId: levelIds[2]?.value,
        threeLevelName: levelIds[2]?.label,
        blackListProductIdS: this.blacklistModal.state.productIds.filter((item: any) => !item.err).map((item: any) => item.val)
      }
      let fn
      let msg: string = ''
      if (this.id) {
        params.serialNo = this.id
        fn = refundAutoUpdate
        msg = '修改成功'
      } else {
        fn = refundAutoAdd
        msg = '添加成功'
      }
      fn(params).then((res: any) => {
        if (!res) {
          return
        }
        APP.success(msg)
        APP.history.push('/order/autoRefundRule')
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

  handleBlackDetail = () => {
    const { detail } = this.state
    if (detail.blackListProductMsg?.length) {
      this.props.alert({
        footer: null,
        title: '黑名单商品',
        content: (
          <List
            size='small'
            dataSource={detail.blackListProductMsg}
            renderItem={item => (
              <List.Item>{item.productId} - {item.productName}</List.Item>
            )}
          />
        )
      })
    } else {
      APP.error('暂无配置')
    }
  }

  handleProductCategoryChange = () => {
    this.blacklistModal.setFieldsValue({
      productIds: ''
    })
  }

  render () {
    const {
      form: { getFieldDecorator, getFieldValue }
    } = this.props
    const { detail } = this.state

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

    if (this.id) {

      if (!detail) {
        return (
          <Card loading={true} />
        )
      }
      if (detail.status !== StatusEnum['待启用']) {
        return (
          <Card
            title={'配置详情'}
            bordered={false}
          >
            <Form>
              <FormItem {...formItemLayout} label='配置编号'>
                {detail.serialNo}
              </FormItem>
              <FormItem {...formItemLayout} label='启用状态'>
                {StatusEnum[detail.status]}
              </FormItem>
              <FormItem {...formItemLayout} label='创建时间'>
                {APP.fn.formatDate(detail.createTime)}
              </FormItem>
              <FormItem {...formItemLayout} label='配置名称'>
                {detail.disposeName}
              </FormItem>
              <FormItem {...formItemLayout} label='创建人'>
                {detail.createUName || '-'} {detail.createUid}
              </FormItem>
              <FormItem {...formItemLayout} label='售后类型'>
                {detail.refundTypeS.map((item: any, i: number) => (
                  <Tag key={i}>{RefundTypeEnum[item]}</Tag>
                ))}
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
                    {detail.oneLevelName}/{detail.twoLevelName}/{detail.threeLevelName}
                  </Col>
                  <Col span={12}>
                    <Button
                      type='link'
                      onClick={this.handleBlackDetail}
                      style={{ color: detail.blackListProductMsg?.length ? '#40a9ff' : '#999999' }}
                    >
                      商品黑名单
                    </Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem {...formItemLayout} label='会员等级'>
                {
                  detail.memberTypeS.map((item: any, i: number) => (
                    <Tag key={i}>{MemberTypeEnum[item]}</Tag>
                  ))
                }
              </FormItem>
              <FormItem {...formItemLayout} label='金额配置'>
                {formatMoneyWithSign(detail.refundMoney)}
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button
                  type='primary'
                  onClick={() => {
                    APP.history.push('/order/autoRefundRule')
                  }}
                >
                  返回
                </Button>
              </FormItem>
            </Form>
          </Card>
        )
      }
    }

    const levelIds = getFieldValue('levelIds')

    return (
      <Card
        title={this.id ? '修改配置' : '新增配置'}
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
                maxLength={40}
                placeholder='请输入'
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='售后类型选择'>
            {getFieldDecorator('refundTypeS', {
              rules: [
                {
                  required: true,
                  message: '请选择'
                }
              ]
            })(
              <XtCheckBox
                options={[
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
                    onChange={this.handleProductCategoryChange}
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
          <FormItem {...formItemLayout} label='会员等级'>
            {getFieldDecorator('memberTypeS', {
              rules: [
                {
                  required: true,
                  message: '请选择'
                }
              ]
            })(
              <XtCheckBox
                options={[
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
                precision={2}
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

export default Form.create()(Alert(Main))