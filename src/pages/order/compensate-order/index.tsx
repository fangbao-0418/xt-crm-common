import React from 'react'
import { Button } from 'antd'
import { If, ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import CouponSelector from './components/coupon-selector'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig } from './config'
import { OrderProps } from './interface'
import { parseQuery } from '@/util/utils'
import { getOrderlist, exportCompensate } from './api'

interface Props extends AlertComponentProps {}

class Main extends React.Component<Props> {
  public childOrderCode = (parseQuery() as any)?.childOrderCode
  listPage: ListPageInstanceProps
  columns: ColumnProps<OrderProps>[] = [
    {
      title: '补偿单编号',
      dataIndex: 'compensateCode',
      fixed: 'left'
    },
    {
      title: '订单编号',
      dataIndex: 'childOrderCode'
    },
    {
      title: '订单商品',
      dataIndex: 'skuName'
    },
    {
      title: '商品ID',
      dataIndex: 'productId'
    },
    {
      title: '供应商',
      dataIndex: 'storeName'
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName'
    },
    {
      title: '状态',
      dataIndex: 'compensateStatusName'
    },
    {
      title: '类型',
      dataIndex: 'compensatePayName'
    },
    {
      title: '金额',
      dataIndex: 'compensateAmount',
      render: text => APP.fn.formatMoney(text)
    },
    {
      title: '责任归属',
      dataIndex: 'responsibilityName'
    },
    {
      title: '用户手机',
      dataIndex: 'memberPhone'
    },
    {
      title: '创建人',
      dataIndex: 'creatorName'
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      render: text => APP.fn.formatDate(text)
    },
    {
      title: '最后处理时间',
      dataIndex: 'lastDealTime',
      render: text => APP.fn.formatDate(text)
    },
    {
      title: '操作',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <span
              className='href'
              onClick={() => {
                APP.history.push(`/order/compensate-order/${record.compensateCode}`)
              }}
            >
              查看详情
            </span>
          </>
        )
      }
    }
  ]
  export = () => {
    const { compensateAmount, ...payload } = this.listPage.form.getValues()
    exportCompensate({
      ...payload,
      minCompensateAmount: compensateAmount?.[0],
      maxCompensateAmount: compensateAmount?.[1]
    }).then(() => {
      APP.success('导出成功，请前往下载列表下载文件')
    })
  }
  coupon = () => {
    let selectedRowKeys: any[] = []
    this.props.alert({
      width: 1000,
      title: '关联优惠券',
      content: (
        <CouponSelector
          readonly={false}
          selectedRowKeys={selectedRowKeys}
          onChange={(rowKeys) => {
            selectedRowKeys = rowKeys
          }}
        />
      ),
      onOk: () => {
        console.log(selectedRowKeys, 'selectedRowKeys')
      }
    })
  }
  render () {
    return (
      <ListPage
        getInstance={ref => this.listPage = ref}
        reserveKey='/order/compensate-order'
        formConfig={getFieldsConfig()}
        columns={this.columns}
        api={getOrderlist}
        processPayload={({ compensateAmount, ...payload }) => {
          if (this.childOrderCode) {
            this.listPage?.form.setValues({
              childOrderCode: this.childOrderCode
            })
            payload.childOrderCode = this.childOrderCode
            this.childOrderCode = undefined
          }
          return {
            ...payload,
            minCompensateAmount: compensateAmount?.[0],
            maxCompensateAmount: compensateAmount?.[1]
          }
        }}
        tableProps={{
          scroll: {
            x: true
          }
        }}
        addonAfterSearch={(
          <>
            <Button
              type='primary'
              className='mr8'
              onClick={this.export}
            >
              导出
            </Button>
            <Button
              type='primary'
              onClick={this.coupon}
            >
              关联优惠券
            </Button>
          </>
        )}
      />
    )
  }
}
export default Alert(Main)