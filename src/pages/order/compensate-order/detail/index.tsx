import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { Card, Table, Tabs, Divider, Button, List, Radio } from 'antd'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Image from '@/components/Image'
import Info from '../components/info'
import { If } from '@/packages/common/components'
import { replaceHttpUrl } from '@/util/utils'
import { getFieldsConfig, getApplInfo, getOrderInfo, getLogisticsInfo, getGoodsInfo, getAuditInfo } from './config'
import { CompensateStatusEnum, CompensatePayTypeEnum } from '../config'
import { getCompensateDetail, getCompensateRecord, auditCompensate, getUserWxAccount } from '../api'

interface Props extends RouteComponentProps<{ compensateCode: string }>, AlertComponentProps {}

interface State {
  detail: any
  detailLoad: boolean
  record: any[]
  recordLoad: boolean
  tabKey: 'detail' | 'record'
  wxAccountList: any[]
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
    wxAccountList: []
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
          record.operatorRoleName + ': ' + record.operatorName
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

  handleAduit = () => {
    const { detail, wxAccountList } = this.state
    let form: FormInstance
    this.props.alert({
      title: '审核',
      content: (
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          config={getFieldsConfig()}
          getInstance={(ref) => {
            form = ref
          }}
        >
          <FormItem verifiable name='compensateStatus' />
          <FormItem verifiable name='responsibilityType' />
          <If
            condition={[
              CompensatePayTypeEnum['喜团账户余额'],
              CompensatePayTypeEnum['支付宝转账'],
              CompensatePayTypeEnum['微信转账']
            ].includes(detail.compensatePayType)}
          >
            <FormItem verifiable name='compensateAmount' />
          </If>
          <If
            condition={[
              CompensatePayTypeEnum['优惠券']
            ].includes(detail.compensatePayType)}
          >
            <FormItem verifiable name='compensateAmount' />
          </If>
          <If
            condition={[
              CompensatePayTypeEnum['支付宝转账']
            ].includes(detail.compensatePayType)}
          >
            <>
              <FormItem label='转账方式'>支付宝转账</FormItem>
              <FormItem verifiable name='recepitorAccountName' />
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
                inner={(form) => {
                  return form.getFieldDecorator('wxInfo')(
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
                            value={`${item.openId}:${item.memberId}|${item.nickname}`}
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
          <FormItem verifiable required name='illustrate' />
          <FormItem verifiable name='remarks' />
        </Form>
      ),
      onOk: () => {
        form.props.form.validateFields((err, values) => {
          if (err) {
            return
          }
          console.log(values)
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

  fetchDetail = () => {
    getCompensateDetail({
      compensateCode: this.compensateCode
    }).then((detail) => {
      this.setState({
        detailLoad: true,
        detail: detail || {}
      }, () => {
        this.fetchWxAccount()
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