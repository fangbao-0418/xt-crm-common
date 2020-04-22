import React, { Component } from 'react'
import { Card, Row, Col, Button, Table } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Image from '@/components/Image'
import { replaceHttpUrl } from '@/util/utils'
import { formatMoneyWithSign } from '@/pages/helper'
import { If } from '@/packages/common/components'
import Upload from '@/components/upload'
import moment from 'moment'
import Countdown from '../components/countdown/index'
import { getFieldsConfig } from './config'
import style from './style.m.styl'

/** 售后详情header部分 */
const detailTabHear = (dataSource: any) => {
  const { refundCode, refundStatusDesc, countdown, refundStatus } = dataSource
  console.log(countdown, 'countdowncountdown')
  return (
    <div className='mb10'>
      <Card>
        <Row align='middle'>
          <Col className={style['detail-col']} span={8}>
            售后单编号:{refundCode}
          </Col>
          <Col className={style['detail-col']} span={8}>
            售后状态:{refundStatusDesc}
          </Col>
          <If condition={ refundStatus === 10 && countdown }>
            <Col className={style['detail-col']} span={8}>
              审核倒计时:
              <Countdown value={countdown / 1000 }></Countdown>
            </Col>
          </If>
        </Row>
      </Card>
    </div>
  )
}

/** 售后审批后信息模板 */
const auditAfterInfoTemplate = (dataSource: any) => {
  const { handleInfo, refundStatus } = dataSource
  const { handleTime, explain, refundReason, toWarehouse, refundServerNum, refundAmount, handleRefundProof } = handleInfo
  return (
    <div className='mb10'>
      <Card>
        <h3>售后处理信息</h3>
        <Row>
          <Col>
            处理结果：{
              refundStatus === 40 ? '不同意' : '同意'
            }
          </Col>
          <Col>
            处理时间：{moment(handleTime).format('YYYY-MM-DD HH:mm:ss')}
          </Col>
          <Col>
            售后原因：{refundReason}
          </Col>
          <Col>
            是否需要送回仓库：{toWarehouse === 0 ? '需要' : '为需要'}
          </Col>
          <Col>
            售后数目：{refundServerNum}
          </Col>
          <Col>
            退款金额：{formatMoneyWithSign(refundAmount)}
          </Col>
          <Col>
            说    明：{explain}
          </Col>
          <Col>
            图片凭证：{handleRefundProof && handleRefundProof.map((img: any, index: number) =>{
              return (
                <Image
                  key={index}
                  style={{
                    height: 100,
                    width: 100,
                    minWidth: 100
                  }}
                  src={replaceHttpUrl(img)}
                  alt='主图'
                />
              )
            })}
          </Col>
        </Row>
      </Card>
    </div>
  )
}

/** 申请信息模板 */
const applyInfoTemplate = (dataSource: any) => {
  const { applyInfo } = dataSource
  const { refundType, refundReason, refundInfo, amount, applyTime, refundProof } = applyInfo || {}
  return (
    <div className='mb10'>
      <Card>
        <h3>售后申请信息</h3>
        <Row>
          <Col>
            售后类型：{ refundType === 10 ? '退货退款' : refundType === 20 ? '仅退款' : ''}
          </Col>
          <Col>
            售后原因：{refundReason}
          </Col>
          <Col>
            申请时间：{moment(applyTime).format('YYYY-MM-DD HH:mm:ss')}
          </Col>
          <Col>
            申请售后数目：1
          </Col>
          <Col>
            申请售后金额：{formatMoneyWithSign(amount)}
          </Col>
          <Col>
            售后说明：{refundInfo}
          </Col>
          <Col>
            图片凭证：
            {
              refundProof && refundProof.map((img: string, index: number) => {
                return (
                  <Image
                    key={index}
                    style={{
                      height: 100,
                      width: 100,
                      minWidth: 100
                    }}
                    src={replaceHttpUrl(img)}
                    alt='主图'
                  />
                )
              })
            }
          </Col>
        </Row>
      </Card>
    </div>
  )
}

/** 订单信息 */
const orderInfo = (dataSource: any) => {
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
      dataIndex: 'skuProperties',
      key: 'skuProperties'
    },
    {
      title: '购买单价',
      dataIndex: 'dealPrice',
      key: 'dealPrice',
      render: (unitPrice: string) => {
        return (
          <div>
            {formatMoneyWithSign(unitPrice)}
          </div>
        )
      }
    },
    {
      title: '购买数量',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: '商品总价(元)',
      dataIndex: 'dealTotalPrice',
      key: 'dealTotalPrice',
      render: (dealTotalPrice: number) => {
        return (
          <>
            {formatMoneyWithSign(dealTotalPrice)}
          </>
        )
      }
    },
    {
      title: '使用优惠券',
      dataIndex: 'couponPrice',
      key: 'couponPrice',
      render: (couponPrice: string) => {
        return (
          <div>
            {formatMoneyWithSign(couponPrice)}
          </div>
        )
      }
    },
    {
      title: '应付金额',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: (orderAmount: number) => {
        return (
          <>
            {formatMoneyWithSign(orderAmount)}
          </>
        )
      }
    },
    {
      title: '优惠金额',
      dataIndex: 'discountPrice',
      key: 'discountPrice',
      render: (discountPrice: string) => {
        return (
          <div>
            {formatMoneyWithSign(discountPrice)}
          </div>
        )
      }
    },
    {
      title: '实付金额',
      dataIndex: 'payMoney',
      key: 'payMoney',
      render: (payMoney: number) => {
        return (
          <>
            {formatMoneyWithSign(payMoney)}
          </>
        )
      }
    }
  ]
  const { orderWideDO, orderAmount } = dataSource
  console.log(orderWideDO, 'orderWideDO')
  return (
    <div className='mb10'>
      <Card>
        <h3>订单信息</h3>
        <Row>
          <Col>
            买家名称：{orderWideDO.receiverName}
          </Col>
          <Col>
            联系电话：{orderWideDO.receiverPhone}
          </Col>
          <Col>
            下单门店：{orderWideDO.storeName}
          </Col>
          <Col>
            <div className='mt10'>
              售后商品
              <Table pagination={false} columns={columns} dataSource={[{ ...orderWideDO, ...orderAmount }]} />
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

/** 审批模板 */
class AuditTemplate extends React.Component<any, any> {
  public form: FormInstance
  /**
   * 售后提审
   *
   * @memberof AuditTemplate
   */
  public save = () => {
    this.form.props.form.validateFields((err) => {
      if (err) {
        APP.error('请检查输入项是否正确')
        return
      }
      this.props.saveAudit(this.form.getValues())
    })
  }
  public render () {
    const values = this.form && this.form.getValues()
    const { refundStatus } = this.props.dataSource
    const { auditOperation } = values || {}
    return (
      <div className='mb10'>
        <Card>
          <h3>{refundStatus === 10 ? '审核信息' : refundStatus === 24 ? '收货确认' : ''}</h3>
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
              name='auditOperation'
            />
            <If condition={auditOperation === 0}>
              <FormItem
                verifiable
                name='refundReason'
              />
              <If condition={refundStatus === 10}>
                <FormItem
                  verifiable
                  name='toWarehouse'
                >
                </FormItem>
              </If>
              <FormItem
                verifiable
                type='number'
                name='auditServerNum'
              />
              <FormItem
                verifiable
                type='number'
                name='auditRefundAmount'
              />
            </If>
            <If condition={auditOperation === 1}>
              <FormItem
                label='售后凭证'
                inner={(form) => {
                  return (
                    <div>
                      {form.getFieldDecorator('refundAuditImageS')(
                        <Upload listNum={9} listType='picture-card' />
                      )}
                    </div>
                  )
                }}
              />
            </If>
            <FormItem
              verifiable={auditOperation === 1}
              name='auditAuditInfo'
            />
            <FormItem>
              <Button
                className='mr20'
                type='primary'
                onClick={() => this.save()}
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