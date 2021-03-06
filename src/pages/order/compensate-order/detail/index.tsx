import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Card, Table, Tabs, Divider, Button, List } from 'antd'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Image from '@/components/Image'
import Info from '../components/info'
import AuditForm from '../components/audit-form'
import { If } from '@/packages/common/components'
import { replaceHttpUrl } from '@/util/utils'
import { getApplInfo, getOrderInfo, getLogisticsInfo, getGoodsInfo, getAuditInfo, getResultInfo } from './config'
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
  /* 补偿详情 */
  detail: any
  /* 补偿详情加载完成标识 */
  detailLoad: boolean
  /* 信息记录 */
  record: any[]
  /* 信息记录加载完成标识 */
  recordLoad: boolean
  /* tab切换key */
  tabKey: 'detail' | 'record'
  /* 微信账号选择列表 */
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

  /* 商品信息表头 */
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
        const url = record.orderType===55?`/goods/virtual/${id}`:`/goods/sku-sale/${id}`
        return (
          <span onClick={() => APP.open(url)} className='href'>{id}</span>
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
      dataIndex: 'couponPrice',
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

  /* 审核信息表头 */
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
      render: (text: any, record: any) => {
        if (!text||record.operateType===2) {
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

  /* 信息记录表头 */
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

  /* 物流信息表头 */
  logisticsColums = [
    {
      title: '物流公司',
      dataIndex: 'expressName'
    },
    {
      title: '物流单号',
      dataIndex: 'expressCode'
    }
  ]

  componentDidMount () {
    this.fetchDetail()
  }

  /* 审核操作 */
  handleAduit = () => {
    const { detail, wxAccountList, quota, roleQuotas, roleType } = this.state
    let auditForm: any
    const hide = this.props.alert({
      title: '审核',
      content: (
        <AuditForm
          getInstance={(ref) => {
            auditForm = ref
          }}
          detail={detail}
          wxAccountList={wxAccountList}
          quota={quota}
          roleQuotas={roleQuotas}
          roleType={roleType}
        />
      ),
      onOk: () => {
        auditForm.form.props.form.validateFields((err: any, { operateType, compensateAmount, memberId, transferEvidenceImgs, remarks, ...values }: any) => {
          if (err) {
            return
          }
          let params: any = {
            compensateCode: this.compensateCode,
            operateType,
            remarks
          }
          if (operateType === 3) { // 同意
            const { wxAccountList } = this.state
            transferEvidenceImgs = Array.isArray(transferEvidenceImgs) ? transferEvidenceImgs.map((v: any) => v.url) : []
            transferEvidenceImgs = transferEvidenceImgs.map((urlStr: string) => APP.fn.deleteOssDomainUrl(urlStr))
            values.transferEvidenceImgs = transferEvidenceImgs
            const currentWx = wxAccountList.find(item => item.memberId === memberId)
            if (currentWx) {
              values.receiptorAccountNo = currentWx.appId + ':' + currentWx.openId
              values.receiptorAccountName = currentWx.nickname
            }
            values.compensateAmount = APP.fn.formatMoneyNumber(compensateAmount)
            params = {
              ...params,
              ...values
            }
          }
          auditCompensate(params).then(() => {
            hide()
            APP.success('操作成功')
            this.fetchDetail()
          })
        })
      }
    })
  }

  /* tab切换 */
  handleTabChange = (tabKey: any) => {
    this.setState({
      tabKey
    }, () => {
      if (!this.state.recordLoad && tabKey === 'record') {
        this.fetchRecord()
      }
    })
  }

  /* 获取不同等级客服的数据 */
  fetchRoleAmount = () => {
    getRoleAmount().then((res: any) => {
      this.setState({
        quota: res?.quota,
        // 这里筛选优选的客服等级
        roleQuotas: (res?.roleQuotas || []).filter((item: any) => item.orderBizType === 0),
        roleType: res?.roleType
      })
    })
  }

  /* 客服详情 */
  fetchDetail = () => {
    getCompensateDetail({
      compensateCode: this.compensateCode
    }).then((detail) => {
      this.setState({
        detailLoad: true,
        detail: detail || {}
      }, () => {
        if (detail?.isCanAudit) {
          this.fetchWxAccount()
          this.fetchRoleAmount()
        }
      })
    })
  }

  /* 获取微信选项列表 */
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

  /* 获取信息记录数据 */
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
      content: '确认重新发送订单补偿请求吗?',
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
                  <If
                    condition={
                      [
                        CompensateStatusEnum['已完成']
                      ]
                        .includes(detail.compensateStatus)
                    }
                  >
                    <>
                      <Divider dashed style={{ margin: '12px 0' }} />
                      <Info title='结果信息' column={3} data={getResultInfo(detail)} />
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