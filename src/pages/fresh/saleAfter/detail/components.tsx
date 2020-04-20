import React, { Component } from 'react'
import { Tabs, Card, Row, Col, Button, Table } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { If } from '@/packages/common/components'
import Upload from '@/components/upload'
import { getFieldsConfig } from './config'

import style from './style.m.styl'

/** 售后详情header部分 */
const detailTabHear = () => {
  return (
    <div className='mb10'>
      <Card>
        <Row align='middle'>
          <Col className={style['detail-col']} span={8}>
            售后单编号:20190418131456778899
          </Col>
          <Col className={style['detail-col']} span={8}>
            售后状态:待合伙人审核
          </Col>
          <Col className={style['detail-col']} span={8}>
            审核倒计时:23:22:22
          </Col>
        </Row>
      </Card>
    </div>

  )
}

/** 售后审批后信息模板 */
const auditAfterInfoTemplate = () => {
  return (
    <div className='mb10'>
      <Card>
        <h3>售后处理信息</h3>
        <Row>
          <Col>
            处理结果：同意售后
          </Col>
          <Col>
            处理时间：2020.09.09 12:33:33
          </Col>
          <Col>
            售后原因：不想要了
          </Col>
          <Col>
            是否需要送回仓库：
          </Col>
          <Col>
            售后数目：2
          </Col>
          <Col>
            退款金额：250
          </Col>
          <Col>
            说    明：安排售后退货退款1个，退款2450元
          </Col>
        </Row>
      </Card>
    </div>
  )
}

/** 申请信息模板 */
const applyInfoTemplate = () => {
  return (
    <div className='mb10'>
      <Card>
        <h3>售后申请信息</h3>
        <Row>
          <Col>
            售后类型：生鲜售后
          </Col>
          <Col>
            售后原因：不想要了
          </Col>
          <Col>
            申请时间：2019-07-11 19:22:22
          </Col>
          <Col>
            申请售后数目：1
          </Col>
          <Col>
            申请售后金额：¥121
          </Col>
          <Col>
            售后说明：不想要不想要了不想要了不想要了不想要了不想要了不想要了不想要了不想   要了不想要了不想要了了
          </Col>
          <Col>
            图片凭证：
            <img style={{ maxWidth: '180px' }} src='https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551576743080670.jpg'></img>
            <img style={{ maxWidth: '180px' }} src='https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551576743080670.jpg'></img>
            <img style={{ maxWidth: '180px' }} src='https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551576743080670.jpg'></img>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

/** 订单信息 */
const orderInfo = () => {
  const columns: any = [
    {
      title: '商品名称',
      dataIndex: 'skuName',
      key: 'skuName',
      render: (name: string, record: any) => {
        return (
          <div>商品名称</div>
        )
      }
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
      key: 'productId'
    },
    {
      title: '规格',
      dataIndex: 'properties',
      key: 'properties'
    },
    {
      title: '购买单价',
      dataIndex: 'dealPrice',
      key: 'dealPrice',
      render: (price: string) => {
        return (
          <div>
            {price}
          </div>
        )
      }
    },
    {
      title: '购买数量',
      dataIndex: 'sum',
      key: 'sum'
    },
    {
      title: '商品总价(元)',
      dataIndex: 'dealTotalPrice',
      key: 'dealTotalPrice'
    },
    {
      title: '使用优惠券',
      dataIndex: 'num',
      key: 'num'
    },
    {
      title: '应付金额',
      dataIndex: 'ayMoney',
      key: 'ayMoney'
    },
    {
      title: '优惠金额',
      dataIndex: 'num',
      key: 'price'
    },
    {
      title: '实付金额',
      dataIndex: 'payMoney',
      key: 'payMoney'
    }
  ]
  const data: [] = []
  return (
    <div className='mb10'>
      <Card>
        <h3>订单信息</h3>
        <Row>
          <Col>
            买家名称：韩记光
          </Col>
          <Col>
            联系电话：17682310593
          </Col>
          <Col>
            下单门店：杭州喜团一号店
          </Col>
          <Col>
            <div className='mt10'>
              售后商品
              <Table columns={columns} dataSource={data} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

/** 审批模板 */
class AuditTemplate extends React.Component {
  public form: FormInstance
  public save = () => {
    console.log(this.form, 'this.form')
    this.form.props.form.validateFields((err) => {
      console.log(err, 'err_00001')
      if (err) {
        APP.error('请检查输入项是否正确')
        return
      }
      const values = this.form.getValues()
      console.log(values.handleResult, 'values.handleResult')
    })
  }
  public render () {
    const values = this.form && this.form.getValues()
    const { handleResult } = values || {}
    console.log(values, 'values')
    console.log(handleResult, 'handleResult')
    return (
      <div className='mb10'>
        <Card>
          <h3>审核信息</h3>
          <Form
            getInstance={(ref) => {
              this.form = ref
            }}
            config={getFieldsConfig()}
            onChange={() => {
              this.setState({
                isValuesChange: true
              })
            }}
          >
            <FormItem
              verifiable
              name='handleResult'
            />
            <If condition={handleResult === 0}>
              <FormItem
                verifiable
                name='auditReason'
              />
              <FormItem
                verifiable
                type='number'
                name='saleAfterNumber'
              />
              <FormItem
                verifiable
                name='refundAmount'
              />
            </If>
            <If condition={handleResult === 1}>
              <FormItem
                label='售后凭证'
                inner={(form) => {
                  return (
                    <div>
                      {form.getFieldDecorator('productImage')(
                        <Upload />
                      )}
                      {/* <div>
                        <span>(建议尺寸750*750，300kb内)</span>
                      </div> */}
                    </div>
                  )
                }}
              />
            </If>
            <FormItem
              verifiable={handleResult === 1}
              name='explain'
            />
            <FormItem>
              <Button
                className='mr20'
                type='primary'
                onClick={this.save.bind(this, 0)}
              >
                提交审核
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}

export { detailTabHear, auditAfterInfoTemplate, applyInfoTemplate, orderInfo, AuditTemplate }