import React from 'react'
import { ListPage, FormItem } from '@/packages/common/components'
import { ColumnProps } from 'antd/es/table'
import { getDefaultConfig, promotionStatusEnum } from './config'
import { getPromotionList } from './api'
import { Button } from 'antd'

interface Props {
  type: string
}
class Main extends React.Component<Props, {}> {
  public columns: ColumnProps<any>[] = [{
    title: '活动编号',
    dataIndex: 'promotionId'
  }, {
    title: '活动名称',
    dataIndex: 'title'
  }, {
    title: '报名时间',
    render: (record) => {
      return APP.fn.formatDate(record.applyStartTime,) + '~' + APP.fn.formatDate(record.applyEndTime)
    }
  }, {
    title: '预热时间',
    render: (record) => {
      if (!record.preheatStartTime || !record.preheatEndTime) {
        return '-'
      }
      return APP.fn.formatDate(record.preheatStartTime) + '~' + APP.fn.formatDate(record.preheatEndTime)
    }
  }, {
    title: '活动排期时间',
    render: (record) => {
      return APP.fn.formatDate(record.startTime) + '~' + APP.fn.formatDate(record.endTime)
    }
  }, {
    title: '活动状态',
    dataIndex: 'status',
    render: (text) => {
      return promotionStatusEnum[text]
    }
  }, {
    title: '店铺id',
    dataIndex: 'shopId'
  }, {
    title: '店铺名称',
    dataIndex: 'shopName'
  }, {
    title: '活动报名商品',
    render: (record) => {
      return (
        <>
          <div>全部商品：{record.productCount}个</div>
          <div>sku：{record.skuCount}个</div>
          <div>通过sku：{record.passSkuCount}个</div>
        </>
      )
    }
  }, {
    title: '排序',
    dataIndex: 'sort'
  }, {
    title: '创建人',
    dataIndex: 'operator'
  }, {
    title: '操作',
    render: () => {
      return (
        <>
          <span
            className='href'
            onClick={() => {
              APP.history.push('/shop/detail')
            }}
          >
            编辑
          </span>
          <span className='href ml10'>发布</span>
          <span className='href ml10'>复制</span>
          <span
            className='href ml10'
            onClick={() => {
              APP.history.push('/shop/activity/detail')
            }}
          >查看详情</span>
          <span className='href ml10'>排序</span>
        </>
      )
    }
  }]
  public render() {
    return (
      <ListPage
        formConfig={getDefaultConfig()}
        rangeMap={{
          activityTime: {
            fields: ['startTime', 'endTime']
          }
        }}
        formItemLayout={(
          <>
            <FormItem name='title' />
            <FormItem name='status' />
            <FormItem name='activityTime' />
            <FormItem name='promotionId' />
            <FormItem name='operator' />
          </>
        )}
        addonAfterSearch={(
          <Button
            type='primary'
            onClick={() => {
              APP.history.push('/shop/activity/add')
            }}>
              新建活动
            </Button>
        )}
        columns={this.columns}
        api={getPromotionList}
      />
    )
  }
}

export default Main