import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Card, Table, Tabs, Divider, Button, List } from 'antd'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import Image from '@/components/Image'
import Info from '../components/info'
import { If } from '@/packages/common/components'
import { replaceHttpUrl } from '@/util/utils'
import { getFieldsConfig, getApplInfo, getOrderInfo, getLogisticsInfo, getGoodsInfo, getAuditInfo } from './config'
import { CompensateStatusEnum } from '../config'
import { getCompensateDetail, getCompensateRecord } from '../api'

interface Props extends RouteComponentProps<{ compensateCode: string }>, AlertComponentProps {}

interface State {
  detail: any
  detailLoad: boolean
  record: any[]
  recordLoad: boolean
  tabKey: 'detail' | 'record'
}

class Main extends React.Component<Props, State> {
  compensateCode = this.props.match.params.compensateCode
  /* 补偿申请信息 */
  state: State = {
    detail: null,
    detailLoad: false,
    record: [],
    recordLoad: false,
    tabKey: 'detail'
  }

  goodsColumns = [
    {
      title: '商品名称',
      dataIndex: 'skuName'
    },
    {
      title: '商品名称',
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
      title: '商品ID',
      dataIndex: 'productId'
    },
    {
      title: '属性',
      dataIndex: 'properties'
    },
    {
      title: '单价',
      dataIndex: 'salePrice'
    },
    {
      title: '数量',
      dataIndex: 'quantity'
    },
    {
      title: '商品总价（元）',
      dataIndex: 'salePrice',
      render: APP.fn.formatMoney
    },
    {
      title: '优惠券',
      dataIndex: 'age'
    },
    {
      title: '应付金额',
      dataIndex: 'preferentialTotalPrice',
      render: APP.fn.formatMoney
    },
    {
      title: '优惠金额',
      dataIndex: 'discountPrice',
      render: APP.fn.formatMoney
    },
    {
      title: '实付金额',
      dataIndex: 'payMoney',
      render: APP.fn.formatMoney
    }
  ]

  applyColums = [
    {
      title: '审核结果',
      dataIndex: 'a'
    },
    {
      title: '审核人',
      dataIndex: 'b'
    },
    {
      title: '审核人身份',
      dataIndex: 'c'
    },
    {
      title: '审核时间',
      dataIndex: 'd'
    },
    {
      title: '备注说明',
      dataIndex: 'e'
    },
    {
      title: '修改内容',
      dataIndex: 'f'
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
              header={null}
              footer={null}
              bordered={false}
              dataSource={list}
              renderItem={(item: any) => <List.Item>{item}</List.Item>}
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
          <FormItem verifiable name='compensateAmount' />
          <FormItem verifiable required name='illustrate' />
          <FormItem verifiable name='recepitorAccountName' />
          <FormItem verifiable name='receiptorAccountNo' />
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
  render () {
    const { tabKey, detailLoad, recordLoad, detail, record } = this.state
    return (
      <Card bordered={false}>
        <Tabs activeKey={tabKey} onChange={this.handleTabChange}>
          <Tabs.TabPane tab='补偿详情' key='detail'>
            {
              detailLoad ? (
                <Card
                  title={`补偿单编号：${detail.compensateCode} 补偿状态：${CompensateStatusEnum[detail.compensateStatus]}`}
                  extra={
                    <>
                      <Button type='primary' size='small' onClick={this.handleAduit} className='mr8'>取消请求</Button>
                      <Button type='primary' size='small' onClick={this.handleAduit}>审核</Button>
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
                      <Divider dashed />
                      <Info title='审核信息'>
                        {
                          getAuditInfo(detail)[0] ? (
                            <Table
                              size='small'
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
                  <Divider dashed />
                  <Info title='订单信息' column={3} data={getOrderInfo(detail)} />
                  <Divider dashed />
                  <Info title='商品信息'>
                    <Table
                      size='middle'
                      bordered
                      pagination={false}
                      dataSource={getGoodsInfo(detail)}
                      columns={this.goodsColumns}
                    />
                  </Info>
                  <Divider dashed />
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
                  bordered
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
      </Card>
    )
  }
}

export default Alert(Main)