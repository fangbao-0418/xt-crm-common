import React from 'react'
import { Table, Card, Button } from 'antd'
import { ColumnProps, PaginationConfig } from 'antd/lib/table'
import MoneyRender from '@/components/money-render'
import GoodCell from '@/components/good-cell'
import moment from 'moment'
import * as api from '../api'
import { getFieldsConfig, auditStatusConfig } from './config'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import SelectFetch from '@/components/select-fetch'
import SuppilerSelect from '@/components/suppiler-auto-select'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'

interface State {
  list: any[]
}

function formatTime (text: any, record: GoodsCheck.ItemProps, index: number) {
  return text ? moment(text).format('YYYY-MM-DD HH:mm:ss'): '-'
}

const namespace = 'fresh-goods-check'

class Main extends React.Component<any, State> {
  public listpage: ListPageInstanceProps
  public state: State = {
    list: []
  };
  public form: FormInstance;
  public payload: GoodsCheck.payloadProps = {
    page: 1,
    pageSize: 10,
    total: 0
  }
  /**
   * 条件查询
   */
  public handleSearch = () => {
    const value = this.form.getValues()
    console.log(value, 'applyEndTime', value.applyEndTime)
    this.payload = {
      ...this.payload,
      ...value,
      page: 1
    }
    this.fetchData()
  };
  public columns: ColumnProps<GoodsCheck.ItemProps>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '商品',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return (
          <div style={{ height: 100 }}>
            <GoodCell skuName={text} coverUrl={record.coverUrl} />
          </div>
        )
      }
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      render: APP.fn.formatMoney
    },
    {
      title: '销售价',
      dataIndex: 'salePrice',
      render: APP.fn.formatMoney
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: '供应商名称',
      dataIndex: 'storeName',
      key: 'storeName'
    },
    {
      title: '一级类目',
      dataIndex: 'firstCategoryName',
      key: 'firstCategoryName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: formatTime
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return (auditStatusConfig as any)[String(text)]
      }
    },
    {
      title: '审核人',
      dataIndex: 'auditUser',
      key: 'auditUser',
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return text || '无'
      }
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      render: formatTime
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return record.auditStatus === 1 ? (
          <Button
            type='primary'
            size='small'
            onClick={() => {
              APP.history.push(`/fresh/goods/detail/${record.id}?auditStatus=${record.auditStatus}`)
            }}
          >
            审核
          </Button>
        ): (
          <Button
            size='small'
            onClick={() => {
              APP.history.push(`/fresh/goods/detail/${record.id}?auditStatus=${record.auditStatus}`)
            }}
          >
            查看
          </Button>
        )
      }
    }
  ]
  public reset () {
    this.form.props.form.resetFields()
    this.payload = {
      pageSize: 10,
      page: 1,
      total: 0
    }
    this.fetchData()
  }
  public fetchData = async () => {
    APP.fn.setPayload(namespace, {
      ...this.payload,
      total: undefined
    })
    const res = (await api.getToAuditList({
      ...this.payload,
      total: undefined
    })) || {}
    this.payload.total = res.total
    this.setState({ list: res.records })
    console.log('res=>', res)
  };
  public componentDidMount () {
    // this.form.setValues({
    //   ...APP.fn.getPayload<any>(namespace),
    //   ...this.payload,
    //   total: undefined
    // })
    // this.payload = {
    //   ...this.form.getValues(),
    //   pageSize: 10,
    //   page: 1
    // }
    // this.fetchData()
  }
  public onPaginationChange = (page: number, pageSize?: number) => {
    this.payload.page = page
    this.fetchData()
  };
  public render () {
    return (
      <div>
        <ListPage
          reserveKey={namespace}
          columns={this.columns}
          api={api.getToAuditList}
          formConfig={getFieldsConfig()}
          rangeMap={{
            createTime: {
              fields: ['createStartTime', 'createEndTime']
            },
            auditTime: {
              fields: ['auditStartTime', 'auditEndTime']
            }
          }}
          getInstance={ref => {
            this.listpage = ref
          }}
          formItemLayout={(
            <div>
              <FormItem name='productName' />
              <FormItem
                label='商品ID'
                name='productId'
                type='number'
                controlProps={{
                  style: {
                    width: '167px'
                  }
                }}
              />
              <FormItem
                label='一级类目'
                inner={form => {
                  return form.getFieldDecorator('firstCategoryId')(
                    <SelectFetch
                      style={{ width: '174px' }}
                      fetchData={() => {
                        return api.getCategoryTopList()
                      }}
                    />,
                  )
                }}
              />
              <FormItem
                label='供应商名称'
                inner={form => {
                  return form.getFieldDecorator('storeId')(
                    <SuppilerSelect style={{ width: '174px' }} />,
                  )
                }}
              />
              <FormItem
                name='auditStatus'
              />
              <FormItem label='审核人' name='auditUser' />
              <FormItem name='createTime' />
              <FormItem name='auditTime' />
            </div>
          )}
        />
      </div>
    )
  }
}
export default Main
