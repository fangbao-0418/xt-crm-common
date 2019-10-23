import React from 'react'
import { Table, Button } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import malert, { AlertComponentProps } from '@/packages/common/components/alert'
import { getFieldsConfig } from './config'
import ShopModal from './components/shop-modal'
import Image from '@/components/Image'
import SuppilerSelect from '@/components/suppiler-auto-select'
import * as api from './api'
import { formatDate, formatMoneyWithSign } from '@/pages/helper'
interface State {
  total: number
  pageSize?: number
  page?: number
  dataSource: CreditPay.ItemProps[]
  selectedRowKeys: any[]
}
enum periodEnum {
  '三期' = 3,
  '六期' = 6,
  '十二期' = 12
}
class Main extends React.Component<AlertComponentProps, State> {
  public payload: CreditPay.PayloadProps = {
    page: 1,
    pageSize: 10,
    status: 0,
    enableHb: 1,
    enableStatus: 0
  }
  public form: FormInstance
  public columns: ColumnProps<CreditPay.ItemProps>[] = [
    {
      dataIndex: 'id',
      title: '商品ID'
    },
    {
      dataIndex: 'coverUrl',
      title: '主图',
      width: 120,
      align: 'center',
      render: (text) => {
        return (
          <Image
            src={text}
          />
        )
      }
    },
    {
      dataIndex: 'productName',
      title: '商品名称',
      width: 150,
    },
    {
      dataIndex: 'status',
      title: '上架状态',
      render: (text) => {
        const statusEnum = ['已下架', '已上架']
        return statusEnum[text]
      }
    },
    {
      dataIndex: 'storeName',
      title: '供应商'
    },
    {
      dataIndex: 'salePrice',
      title: '销售价',
      render: (text) => formatMoneyWithSign(text)
    },
    {
      dataIndex: 'maxHbFqNum',
      title: '最大分期期数',
      render: (text) => periodEnum[text]
    },
    {
      dataIndex: 'maxFqSellerPercent',
      title: '最大免息期数',
      render: (text) => periodEnum[text]
    },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: (text, record) => {
        return (
          <div>
            <span
              className='href mr10'
              onClick={() => {
                APP.history.push(`/activity/credit_pay/${record.id}`)
              }}
            >
              编辑
            </span>
            <span
              className='href'
              onClick={() => {
                this.props.alert({
                  content: (
                    <div className='text-center'>
                      <div>是否关闭商品分期权限</div>
                      <div className='font12'>(关闭后商品不再显示在分期商品列表中)</div>
                    </div>
                  ),
                  onOk: (hide) => {
                    this.deleteShop([record.id]).then(() => {
                      this.fetchData()
                      hide()
                    })
                  }
                })
              }}
            >
              关闭权限
            </span>
          </div>
        )
      }
    }
  ]
  public state: State = {
    total: 0,
    page: 1,
    pageSize: this.payload.pageSize || 10,
    dataSource: [],
    selectedRowKeys: []
  }
  public constructor (props: any) {
    super(props)
    this.onRowSelectionChange = this.onRowSelectionChange.bind(this)
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    api.fetchList(this.payload).then((res) => [
      this.setState({
        page: this.payload.page,
        total: res.total,
        dataSource: res.records
      })
    ])
  }
  public addCreditPayShop (ids: number[]) {
    return api.addCreditPayShop(ids)
  }
  public onRowSelectionChange (selectedRowKeys: any[]) {
    console.log(selectedRowKeys, 'selectedRowKeys')
    this.setState({
      selectedRowKeys: selectedRowKeys
    })
  }
  public deleteShop (ids: number[] = this.state.selectedRowKeys) {
    if (ids.length === 0) {
      APP.error('请选择商品')
    }
    return api.deleteCreditPayShop(ids)
  }
  public reset () {
    this.form.props.form.resetFields()
    this.payload = {
      pageSize: 10,
      status: 0,
      enableHb: 1,
      enableStatus: 0,
      page: 1
    }
    this.fetchData()
  }
  public render () {
    const { selectedRowKeys } = this.state
    const rowSelection: TableRowSelection<CreditPay.ItemProps> = {
      selectedRowKeys,
      onChange: this.onRowSelectionChange
    }
    return (
      <div
        style={{
          background: '#FFF',
          padding: 20
        }}
      >
        <div>
          <Form
            layout='inline'
            config={getFieldsConfig()}
            getInstance={(ref) => {
              this.form = ref
            }}
            addonAfter={(
              <div
                style={{
                  display: 'inline-block',
                  lineHeight: '40px',
                  verticalAlign: 'top'
                }}
              >
                <Button
                  type='primary'
                  className='mr10'
                  onClick={() => {
                    const value = this.form.getValues()
                    if (value.status === undefined) {
                      value.enableStatus = 0
                    } else {
                      value.enableStatus = 1
                    }
                    this.payload = {
                      ...this.payload,
                      ...value,
                      page: 1
                    }
                    this.fetchData()
                  }}
                >
                  查询
                </Button>
                <Button
                  onClick={() => {
                    this.reset()
                  }}
                >
                  清除
                </Button>
              </div>
            )}
          >
            <FormItem name='productName' />
            <FormItem name='productId' />
            <FormItem
              label='供应商'
              inner={(form) => {
                return form.getFieldDecorator('storeId')(
                  <SuppilerSelect style={{width: '174px'}}/>
                )
              }}
            />
            <FormItem name='status' />
            <FormItem name='maxHbFqNum' />
            <FormItem name='maxFqSellerPercent' />
          </Form>
        </div>
        <div
          className='mt10'
        >
          <div
            className='mb10'
          >
            <Button
              type='primary'
              className='mr10'
              onClick={() => {
                this.props.alert({
                  content: (
                    <div className='text-center'>
                      <div>是否关闭所有选中商品的分期权限</div>
                      <div className='font12'>(关闭后商品不再显示在分期商品列表中)</div>
                    </div>
                  ),
                  onOk: (hide) => {
                    this.deleteShop().then(() => {
                      hide()
                      this.fetchData()
                    })
                  }
                })
              }}
            >
              批量关闭分期权限
            </Button>
            <Button
              type='primary'
              onClick={() => {
                const showmodal: any =  this.refs.shopmodal
                showmodal.open()
              }}
            >
              新增分期商品
            </Button>
          </div>
          <Table
            rowKey='id'
            rowSelection={rowSelection}
            className='mb10'
            columns={this.columns}
            dataSource={this.state.dataSource}
            pagination={{
              total: this.state.total,
              pageSize: this.state.pageSize,
              current: this.state.page,
              onChange: (current) => {
                this.payload.page = current
                this.fetchData()
              }
            }}
          />
        </div>
        <ShopModal
          ref='shopmodal'
          onOk={(value, hide) => {
            const ids = value.map((item) => item.id)
            if (ids.length > 0) {
              this.addCreditPayShop(ids).then(() => {
                hide()
                this.payload.page = 1
                this.fetchData()
              })
            } else {
              hide()
            }
          }}
        />
      </div>
    )
  }
}
export default malert<AlertComponentProps>(Main)
