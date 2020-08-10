import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { Card, Table, Tabs, Divider, Button, List, Radio } from 'antd'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Image from '@/components/Image'
import Info from '../components/info'
import { If } from '@/packages/common/components'
import { replaceHttpUrl, initImgList } from '@/util/utils'
import { getFieldsConfig, getApplInfo, getOrderInfo, getLogisticsInfo, getGoodsInfo, getAuditInfo } from './config'
import { CompensateStatusEnum, CompensatePayTypeEnum } from '../config'
import { getCompensateDetail, getCompensateRecord, auditCompensate, getUserWxAccount, getRoleAmount } from '../api'

enum CustomerRoleEnums {
  '普通客服' = 1,
  '客服组长' = 2,
  '客服主管' = 3,
  '客服经理' = 4,
}

interface Props extends RouteComponentProps<{ compensateCode: string }>, AlertComponentProps {}

interface State {
  detail: any
  detailLoad: boolean
  record: any[]
  recordLoad: boolean
  tabKey: 'detail' | 'record'
  wxAccountList: any[]
  /* 免费审核额度 */
  quota: number
  /* 不同等级的审核值 */
  roleQuotas: any[]
  /* 客服等级 */
  roleType: number
}

class Main extends React.Component<Props, State> {
  compensateCode = this.props.match.params.compensateCode
  /* 补偿申请信息 */
  state: State = {
    detail: null,
    detailLoad: false,
    record: [],
    recordLoad: false,
    tabKey: 'detail',
    wxAccountList: [],
    quota: 0,
    roleQuotas: [],
    roleType: 0
  }

  goodsColumns = [
    {
      title: '商品图片',
      width: 116,
      dataIndex: 'productImage',
      render: (text: any) => (
        <Image
          style={{
            height: 100,
            width: 100,
            minWidth: 100
          }}
          src={replaceHttpUrl(text)}
          alt='商品图片'
        />
      )
    },
    {
      title: '商品名称',
      dataIndex: 'skuName'
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
      render (id: any, record: any) {
        return (
          <Link to={record.orderType===55?`/goods/virtual/${id}`:`/goods/sku-sale/${id}`}>{id}</Link>
        )
      }
    },
    {
      title: '属性',
      dataIndex: 'properties'
    },
    {
      title: '供应商',
      dataIndex: 'storeName'
    },
    {
      title: '单价',
      dataIndex: 'salePrice',
      render: APP.fn.formatMoney
    },
    {
      title: '数量',
      dataIndex: 'quantity'
    },
    {
      title: '商品总价（元）',
      dataIndex: 'saleTotalPrice',
      render: APP.fn.formatMoney
    },
    {
      title: '优惠券',
      dataIndex: 'faceValue',
      render: APP.fn.formatMoney
    },
    {
      title: '应付金额',
      dataIndex: 'dealTotalPrice',
      render: APP.fn.formatMoney
    },
    {
      title: '优惠金额',
      dataIndex: 'discountPrice',
      render: APP.fn.formatMoney
    },
    {
      title: '满减优惠',
      dataIndex: 'promotionReducePrice',
      render: APP.fn.formatMoney
    },
    {
      title: '实付金额',
      dataIndex: 'preferentialTotalPrice',
      render: APP.fn.formatMoney
    }
  ]

  applyColums = [
    {
      title: '审核结果',
      dataIndex: 'operateTypeStr'
    },
    {
      title: '审核人',
      dataIndex: 'operatorName',
      render: (text: any) => text || '-'
    },
    {
      title: '审核人身份',
      dataIndex: 'operatorRoleName'
    },
    {
      title: '审核时间',
      dataIndex: 'createTime',
      render: (text: any) => APP.fn.formatDate(text)
    },
    {
      title: '备注说明',
      dataIndex: 'remarks',
      render: (text: any) => text || '-'
    },
    {
      title: '修改内容',
      dataIndex: 'modifyInfos',
      render: (text: any) => {
        if (!text) {
          return '-'
        }
        try {
          const data = JSON.parse(text)
          const list = data.map((item: any) => {
            return Object.keys(item)?.[0] + ': ' + Object.values(item)?.[0]
          })
          return (
            <List
              size='small'
              split={false}
              header={null}
              footer={null}
              bordered={false}
              dataSource={list}
              renderItem={(item: any) => <List.Item style={{ padding: '2px 0' }}>{item}</List.Item>}
            />
          )
        } catch (error) {
          return '-'
        }
      }
    }
  ]

  infoColums = [
    {
      title: '内容',
      dataIndex: 'info',
      render: (text: any) => {
        try {
          const data = JSON.parse(text)
          const list = data.map((item: any) => {
            return Object.keys(item)?.[0] + ': ' + Object.values(item)?.[0]
          })
          return (
            <List
              size='small'
              split={false}
              header={null}
              footer={null}
              bordered={false}
              dataSource={list}
              renderItem={(item: any) => <List.Item style={{ padding: '2px 0' }}>{item}</List.Item>}
            />
          )
        } catch (error) {
          return '-'
        }
      }
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      render: (text: any) => APP.fn.formatDate(text)
    },
    {
      title: '操作人',
      render: (_: any, record: any) => {
        return (
          // record.operatorRoleName + ': ' + record.operatorName
          record.operatorName || '-'
        )
      }
    }
  ]

  logisticsColums = [
    {
      title: '物流公司',
      dataIndex: 'expressCompanyName'
    },
    {
      title: '物流单号',
      dataIndex: 'expressCode'
    }
  ]

  componentDidMount () {
    this.fetchDetail()
  }

  getAuditMsg = (amount: number = 0) => {
    amount = amount * 100
    const { roleQuotas, roleType } = this.state
    const quotas = roleQuotas.map(item => item.quota).sort((x, y) => y - x)
    const curentRoleQuota = roleQuotas.find(item => item.roleType === roleType)
    const max = Math.max(...quotas)
    if (amount <= curentRoleQuota?.quota) {
      return (
        '<div style="color: green;">额度内，无需审核</div>'
      )
    }
    if (amount > max) {
      return (
        `<div style="color: red;">
          超出最大审核限制${APP.fn.formatMoney(max)}
        </div>`
      )
    }
    const l = quotas.length
    for (let i = 0; i < l; i++) {
      const cur = quotas[i]
      if (amount > cur) {
        const curItem = roleQuotas.find(item => item.quota === cur)
        return (
          `<div style="color: red;">超出额度，需要${CustomerRoleEnums[curItem?.roleType]}审核！</div>`
        )
      } else {
        continue
      }
    }
  }

  handleAduit = () => {
    const { detail, wxAccountList, quota } = this.state
    let form: FormInstance
    let msgRef: HTMLDivElement
    const hide = this.props.alert({
      title: '审核',
      content: (
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          config={getFieldsConfig()}
          getInstance={(ref) => {
            form = ref
          }}
          mounted={() => {
            form.setValues({
              responsibilityType: detail.responsibilityType,
              compensateAmount: detail.compensateAmount / 100,
              memberId: detail.memberId,
              transferEvidenceImgs: (detail.transferEvidenceImg ? JSON.parse(detail.transferEvidenceImg) : []).map((item: any) => initImgList(item)[0]),
              illustrate: detail.illustrate,
              receiptorAccountName: detail.receiptorAccountName,
              receiptorAccountNo: detail.receiptorAccountNo,
              couponCode: detail.couponCode
            })
          }}
        >
          <FormItem verifiable name='operateType' />
          <FormItem verifiable required name='responsibilityType' />
          <If
            condition={[
              CompensatePayTypeEnum['喜团账户余额'],
              CompensatePayTypeEnum['支付宝转账'],
              CompensatePayTypeEnum['微信转账']
            ].includes(detail.compensatePayType)}
          >
            <>
              <FormItem
                controlProps={{
                  onChange: (val: any) => {
                    msgRef.innerHTML = this.getAuditMsg(val) || ''
                  }
                }}
                verifiable
                name='compensateAmount'
              />
              <FormItem style={{ margin: '-24px 0 0' }}>
                <div style={{ lineHeight: '20px', paddingBottom: 16 }}>
                  <div>当前级别免审核额度：{APP.fn.formatMoney(quota)}</div>
                  <div ref={(ref: any) => msgRef = ref}>
                    <div dangerouslySetInnerHTML={{ __html: this.getAuditMsg(detail.compensateAmount / 100) || '' }}></div>
                  </div>
                </div>
              </FormItem>
            </>
          </If>
          <If
            condition={[
              CompensatePayTypeEnum['优惠券']
            ].includes(detail.compensatePayType)}
          >
            <FormItem required verifiable name='couponCode' />
          </If>
          <If
            condition={[
              CompensatePayTypeEnum['支付宝转账']
            ].includes(detail.compensatePayType)}
          >
            <>
              <FormItem label='转账方式'>支付宝转账</FormItem>
              <FormItem verifiable name='receiptorAccountName' />
              <FormItem verifiable name='receiptorAccountNo' />
            </>
          </If>
          <If
            condition={[
              CompensatePayTypeEnum['微信转账']
            ].includes(detail.compensatePayType)}
          >
            <>
              <FormItem label='转账方式'>微信转账</FormItem>
              <FormItem
                required
                label='微信账号'
                inner={(form) => {
                  return form.getFieldDecorator('memberId')(
                    <Radio.Group>
                      {
                        wxAccountList.map(item => (
                          <Radio
                            key={item.memberId}
                            style={{
                              display: 'block',
                              height: '30px',
                              lineHeight: '30px'
                            }}
                            value={item.memberId}
                          >
                            {item.nickname}
                          </Radio>
                        ))
                      }
                    </Radio.Group>
                  )
                }}
              />
            </>
          </If>
          <FormItem required name='transferEvidenceImgs' />
          <FormItem name='illustrate' />
        </Form>
      ),
      onOk: () => {
        form.props.form.validateFields((err, { compensateAmount, memberId, transferEvidenceImgs, ...values }) => {
          if (err) {
            return
          }
          const { wxAccountList } = this.state
          const currentWx = wxAccountList.find(item => item.memberId === memberId)
          if (currentWx) {
            values.receiptorAccountNo = currentWx.openId + ':' + currentWx.memberId
            values.receiptorAccountName = currentWx.nickname
          }
          values.compensateAmount = APP.fn.formatMoneyNumber(compensateAmount)
          auditCompensate({
            compensateCode: this.compensateCode,
            ...values
          }).then(() => {
            hide
            APP.success('操作成功')
            this.fetchDetail()
          })
        })
      }
    })
  }

  handleTabChange = (tabKey: any) => {
    this.setState({
      tabKey
    }, () => {
      if (!this.state.recordLoad && tabKey === 'record') {
        this.fetchRecord()
      }
    })
  }

  fetchRoleAmount = () => {
    const { detail } = this.state
    if (![CompensatePayTypeEnum['微信转账'], CompensatePayTypeEnum['支付宝转账'], CompensatePayTypeEnum['喜团账户余额']].includes(detail.compensatePayType)) {
      return
    }
    getRoleAmount().then((res: any) => {
      this.setState({
        quota: res?.quota,
        roleQuotas: (res?.roleQuotas || []).filter((item: any) => item.orderBizType === 0),
        roleType: res?.roleType
      })
    })
  }

  fetchDetail = () => {
    getCompensateDetail({
      compensateCode: this.compensateCode
    }).then((detail) => {
      this.setState({
        detailLoad: true,
        detail: detail || {}
      }, () => {
        this.fetchWxAccount()
        this.fetchRoleAmount()
      })
    })
  }

  fetchWxAccount = () => {
    const { wxAccountList, detail } = this.state
    if (detail.compensatePayType !== CompensatePayTypeEnum['微信转账']) {
      return
    }
    if (wxAccountList.length) {
      return
    }
    getUserWxAccount({ childOrderCode: detail?.childOrderCode }).then((wxAccountList: any[]) => {
      this.setState({
        wxAccountList: wxAccountList || []
      })
    })
  }

  fetchRecord = () => {
    getCompensateRecord({
      compensateCode: this.compensateCode
    }).then((record) => {
      this.setState({
        recordLoad: true,
        record
      })
    })
  }
  handleCancel = () => {
    const hide = this.props.alert({
      content: '确认取消订单补偿请求吗?',
      onOk: () => {
        auditCompensate({
          compensateCode: this.compensateCode,
          operateType: 1
        }).then(() => {
          APP.success('取消请求成功')
          this.fetchDetail()
          hide()
        })
      }
    })
  }
  handleResent = () => {
    const hide = this.props.alert({
      content: '确认重新发生订单补偿请求吗?',
      onOk: () => {
        auditCompensate({
          compensateCode: this.compensateCode,
          operateType: 4
        }).then(() => {
          APP.success('发送请求成功')
          this.fetchDetail()
          hide()
        })
      }
    })
  }
  render () {
    const { tabKey, detailLoad, recordLoad, detail, record } = this.state
    return (
      <Card bordered={false}>
        <Tabs activeKey={tabKey} onChange={this.handleTabChange}>
          <Tabs.TabPane tab='补偿详情' key='detail'>
            {
              detailLoad ? (
                <Card
                  title={
                    <>
                      <span style={{ fontWeight: 600 }}>补偿单编号: </span>
                      {detail.compensateCode}
                      <span style={{ fontWeight: 600, marginLeft: 12 }}>补偿状态: </span>
                      {CompensateStatusEnum[detail.compensateStatus]}
                    </>
                  }
                  extra={
                    <>
                      <If
                        condition={detail.isCanCancel}
                      >
                        <Button type='primary' size='small' onClick={this.handleCancel} className='mr8'>取消请求</Button>
                      </If>
                      <If
                        condition={detail.isCanAudit}
                      >
                        <Button type='primary' size='small' onClick={this.handleAduit}>审核</Button>
                      </If>
                      <If
                        condition={detail.isCanReSent}
                      >
                        <Button type='primary' size='small' onClick={this.handleResent}>重新发送</Button>
                      </If>
                    </>
                  }
                >
                  <Info title='补偿申请信息' column={2} data={getApplInfo(detail)} />
                  <If
                    condition={
                      [
                        CompensateStatusEnum['待客服主管审核'],
                        CompensateStatusEnum['待客服经理审核'],
                        CompensateStatusEnum['已拒绝'],
                        CompensateStatusEnum['发放失败'],
                        CompensateStatusEnum['已完成']
                      ]
                        .includes(detail.compensateStatus)
                    }
                  >
                    <>
                      <Divider dashed style={{ margin: '12px 0' }} />
                      <Info title='审核信息'>
                        {
                          getAuditInfo(detail)[0] ? (
                            <Table
                              size='middle'
                              bordered
                              pagination={false}
                              dataSource={getAuditInfo(detail)}
                              columns={this.applyColums}
                            />
                          ) : (
                            '暂无数据'
                          )
                        }
                      </Info>
                    </>
                  </If>
                  <Divider dashed style={{ margin: '12px 0' }} />
                  <Info title='订单信息' column={3} data={getOrderInfo(detail)} />
                  <Divider dashed style={{ margin: '12px 0' }} />
                  <Info title='商品信息'>
                    <Table
                      size='middle'
                      bordered
                      pagination={false}
                      dataSource={getGoodsInfo(detail)}
                      columns={this.goodsColumns}
                    />
                  </Info>
                  <Divider dashed style={{ margin: '12px 0' }} />
                  <Info title='物流信息'>
                    {
                      getLogisticsInfo(detail)[0] ? (
                        <Table
                          size='middle'
                          bordered
                          style={{ maxWidth: 600 }}
                          pagination={false}
                          dataSource={getLogisticsInfo(detail)}
                          columns={this.logisticsColums}
                        />
                      ) : (
                        '暂无数据'
                      )
                    }
                  </Info>
                </Card>
              ) : (
                <Card loading={true}></Card>
              )
            }
          </Tabs.TabPane>
          <Tabs.TabPane tab='信息记录' key='record'>
            {
              recordLoad ? (
                <Table
                  style={{ marginBottom: 10 }}
                  bordered
                  scroll={{ x: true }}
                  size='middle'
                  pagination={false}
                  dataSource={record}
                  columns={this.infoColums}
                />
              ) : (
                <Card loading={true}></Card>
              )
            }
          </Tabs.TabPane>
        </Tabs>
        <Button
          type='primary'
          onClick={() => {
            APP.history.push('/order/compensate-order')
          }}
        >
          返回
        </Button>
      </Card>
    )
  }
}

export default Alert(Main)