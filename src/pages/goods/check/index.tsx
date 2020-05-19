import React from 'react'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import MoneyRender from '@/components/money-render'
import GoodCell from '@/components/good-cell'
import moment from 'moment'
import * as api from '../api'
import { getFieldsConfig, auditStatusConfig } from './config'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import SelectFetch from '@/components/select-fetch'
import SuppilerSelect from '@/components/suppiler-select'

function formatTime (text: any, record: GoodsCheck.ItemProps, index: number) {
  return text ? moment(text).format('YYYY-MM-DD HH:mm:ss'): '-'
}

const namespace = 'goods-check'

class Main extends React.Component<{}> {
  public listpage: ListPageInstanceProps
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
        return <GoodCell skuName={text} coverUrl={record.coverUrl} />
      }
    },
    {
      title: '供货价',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: MoneyRender
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      key: 'supplierName'
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
      render: (text: any, record: GoodsCheck.ItemProps, index: number) => {
        return record.auditStatus === 1 ? (
          <Button
            type='primary'
            onClick={() => {
              APP.history.push(`/goods/detail/${record.id}?auditStatus=${record.auditStatus}`)
            }}
          >
            审核
          </Button>
        ): (
          <Button
            onClick={() => {
              APP.history.push(`/goods/detail/${record.id}?auditStatus=${record.auditStatus}`)
            }}
          >
            查看
          </Button>
        )
      }
    }
  ];
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
                name='id'
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
