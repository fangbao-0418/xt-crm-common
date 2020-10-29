import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { getList, rePaid } from './api'
import { formConfig } from './config'
import { Button, Icon, Popconfirm, Tooltip } from 'antd'

class Main extends React.Component {
  public listRef: ListPageInstanceProps
  public columns = [{
    title: '子订单号',
    dataIndex: 'childOrderCode'
  }, {
    title: '保单号',
    dataIndex: 'thirdInsuranceSn'
  }, {
    title: '保额',
    dataIndex: 'insuranceQuota'
  }, {
    title: '保费',
    dataIndex: 'insuranceCost'
  }, {
    title: '起保时间',
    dataIndex: 'insuranceStartTime',
    render: (text: number) => APP.fn.formatDate(text)
  }, {
    title: '终止时间',
    dataIndex: 'insuranceEndTime',
    render: (text: number) => APP.fn.formatDate(text)
  }, {
    title: '运费险状态',
    dataIndex: 'insuranceStatusStr',
    render: (text: string, record: any) => {
      if (record.insuranceStatus === 20) {
        return (
          <>
            <span>{text}</span>
            <Tooltip placement='top' title={record.failReason}>
              <Icon type="info-circle" />
            </Tooltip>
          </>
        )
      }
      return text
    }
  }, {
    title: '报案号',
    dataIndex: 'reportNumber'
  }, {
    title: '赔款金额',
    dataIndex: 'paidPrice',
    render: (text: number) => APP.fn.formatMoneyNumber(text, 'm2u')
  }, {
    title: '支付宝',
    dataIndex: 'paidReciverAccount'
  }, {
    title: '操作',
    render: (record: any) => {
      return record.allowRePaid ? (
        <Popconfirm
          placement='top'
          title='确认重新支付吗？'
          onConfirm={async () => {
            const res = await rePaid(record.insuranceId)
            if (res) {
              APP.success('重新支付成功')
              this.listRef?.refresh()
            }
          }}
          okText='确认'
          cancelText='取消'
        >
          <span className='href'>重新支付</span>
        </Popconfirm>
      ) : '-'
    }
  }]
  public render () {
    return (
      <ListPage
        getInstance={(ref) => {
          this.listRef = ref
        }}
        rangeMap={{
          insuranceTime: {
            fields: ['insuranceStartTime', 'insuranceEndTime']
          }
        }}
        formConfig={formConfig}
        addonAfterSearch={(
          <>
            <Button type='primary'>导出投保excel</Button>
            <Button type='primary' className='ml10'>导出理赔excel</Button>
            <Button type='primary' className='ml10'>导入excel</Button>
          </>
        )}
        columns={this.columns}
        api={getList}
      />
    )
  }
}

export default Main