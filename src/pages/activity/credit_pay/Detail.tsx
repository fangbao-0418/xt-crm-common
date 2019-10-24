import React from 'react'
import { Table, Select, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { withRouter, RouteComponentProps } from 'react-router'
import Form, { FormItem } from '@/packages/common/components/form'
import CostModal from './components/CostModal'
import Image from '@/components/Image'
import { formatDate, formatMoneyWithSign } from '@/pages/helper'
import * as api from './api'
interface State {
  visible: false,
  dataSource: any[]
  costList: any[],
  detail?: CreditPay.ItemProps
}
interface Props extends RouteComponentProps<{id: any}> {}
const statusEnum = ['已下架', '已上架']
const fqOptions: {label: string, value: number}[] = [
  {label: '否', value: -1},
  {label: '3', value: 3},
  {label: '6', value: 6},
  {label: '12', value: 12}
]
const mxOptions: {label: string, value: number}[] = [
  {label: '否', value: -1},
  {label: '3期免息', value: 3},
  {label: '6期免息', value: 6},
  {label: '12期免息', value: 12}
]
class Main extends React.Component<Props> {
  public columns: ColumnProps<any>[] = [
    {
      title: '规格名',
      dataIndex: 'property1',
      render: (text, record) => {
        const detail = Object.assign({
          skuList: []
        }, this.state.detail)
        const { property1, property2} = detail
        const { propertyValue1, propertyValue2 } = record
        return `${property1}:${propertyValue1};` + (property2 ? `${property2}:${propertyValue2};` : '')
      }
    },
    {
      title: '供应商SKUID',
      dataIndex: 'skuId'
    },
    {
      title: '销售价',
      dataIndex: 'salePrice',
      render: (text) => formatMoneyWithSign(text)
    },
    {
      title: '最大分期期数',
      dataIndex: 'maxHbFqNum',
      width: 140,
      render: (text, record, index) => {
        return this.renderSelect({
          options: fqOptions,
          value: record.maxHbFqNum,
          onChange: (value) => {
            const detail =this.state.detail
            if (detail && detail.skuList && detail.skuList[index]) {
              detail.skuList[index].maxHbFqNum = value
            }
            this.setState({
              detail
            })
          }
        })
      }
    },
    {
      title: '用户免息期数',
      dataIndex: 'maxFqSellerPercent',
      width: 140,
      render: (text, record, index) => {
        return this.renderSelect({
          value: record.maxFqSellerPercent,
          options: mxOptions,
          onChange: (value) => {
            const detail = this.state.detail
            if (detail && detail.skuList && detail.skuList[index]) {
              detail.skuList[index].maxFqSellerPercent = value
            }
            this.setState({
              detail
            })
          }
        })
      }
    },
    {
      title: '费用查看',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <span
            className='href'
            onClick={() => {
              this.sku = record
              this.fetchCostDetail()
            }}
          >
            查看
          </span>
        )
      }
    }
  ]
  public id = this.props.match.params.id
  public sku: CreditPay.SkuProps
  public state: State = {
    visible: false,
    costList: [],
    dataSource: [
      {
        price: 444
      }
    ]
  }
  public constructor (props: Props) {
    super(props)
    this.save = this.save.bind(this)
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    api.fetchCreditPayShopDetail(this.id).then((res) => {
      this.setState({
        detail: res
      })
    })
  }
  public fetchCostDetail () {
    api.fetchCostDetail(this.sku.skuId).then((res) => {
      this.setState({
        costList: res,
        visible: true
      })
    })
  }
  public renderSelect (payload: {
    options: {label: string, value: number}[]
    onChange?: (value: any) => void
    value: any
  }) {
    const { options, onChange, value } = payload
    return (
      <Select
        onChange={onChange}
        value={value}
      >
        {
          options.map((item, index) => {
            return (
              <Select.Option
                key={index}
                value={item.value}
              >
                {item.label}
              </Select.Option>
            )
          })
        }
      </Select>
    )
  }
  public save () {
    const detail = this.state.detail
    if (!detail) {
      return
    }
    const { skuList } = detail
    const skuInfos = skuList.map((item) => {
      return {
        skuId: item.skuId,
        maxHbFqNum: item.maxHbFqNum,
        maxFqSellerPercent: item.maxFqSellerPercent
      }
    })
    api.updateCostDetail({
      productId: detail.productId,
      skuInfos: skuInfos
    }).then(() => {
      APP.success('保存成功')
    })
  }
  public render () {
    const detail = Object.assign({
      productCategoryVO: {
        combineName: ''
      },
      skuList: []
    }, this.state.detail)
    return (
      <div
        style={{
          background: '#FFF',
          padding: 20
        }}
      >
        <Form>
          <FormItem
            label='商品名称'
          >
            {detail.productName}
          </FormItem>
          <FormItem
            label='商品类目'
          >
            {detail.productCategoryVO.combineName}
          </FormItem>
          <FormItem
            label='供应商'
          >
            {detail.storeName}
          </FormItem>
          <FormItem
            label='上架状态'
          >
            {statusEnum[detail.status]}
          </FormItem>
          <FormItem
            label='商品主图'
          >
            <Image
              src={detail.coverUrl}
            />
          </FormItem>
          <div>
            <Table
              rowKey='skuId'
              columns={this.columns}
              dataSource={detail.skuList}
              pagination={false}
            />
          </div>
          <FormItem
          >
            <Button
              type='primary'
              onClick={this.save}
            >
              保存
            </Button>
            <Button
              className='ml10'
              onClick={() => {
                APP.history.push('/activity/credit_pay')
              }}
            >
              返回
            </Button>
          </FormItem>
        </Form>
        <CostModal
          dataSource={this.state.costList}
          visible={this.state.visible}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
        />
      </div>
    )
  }
}
export default withRouter(Main)
