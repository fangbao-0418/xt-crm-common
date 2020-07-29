import React from 'react'
import ListPage from '@/packages/common/components/list-page'
import { ColumnProps } from 'antd/es/table'
import { getFieldsConfig } from './config'
import { FormItem } from '@/packages/common/components'
interface Invoice {
  No: string
}

class InvoiceReview extends React.Component {
  public columns: ColumnProps<Invoice>[] = [{
    key: 'No',
    title: '提现申请单编号',
    dataIndex: 'No'
  }, {
    key: 'supplierType',
    title: '供应商类型',
    dataIndex: 'supplierType'
  }, {
    key: 'supplierId',
    title: '供应商ID',
    dataIndex: 'supplierId'
  }, {
    key: 'supplierName',
    title: '供应商名称',
    dataIndex: 'supplierName'
  }, {
    key: 'withdrawalAmount',
    title: '提现金额',
    dataIndex: 'withdrawalAmount'
  }, {
    key: 'supplierName',
    title: '供应商名称',
    dataIndex: 'supplierName'
  }, {
    key: 'withdrawalAmount',
    title: '提现金额',
    dataIndex: 'withdrawalAmount'
  }, {
    key: 'faceValue',
    title: '发票票面总额',
    dataIndex: 'faceValue'
  }, {
    key: 'submissionTime',
    title: '提交时间',
    dataIndex: 'submissionTime'
  }, {
    key: 'auditStatus',
    title: '审核状态',
    dataIndex: 'auditStatus'
  }, {
    key: 'auditPerson',
    title: '审核人',
    dataIndex: 'auditPerson'
  }, {
    key: 'auditTime',
    title: '审核时间',
    dataIndex: 'auditTime'
  },  {
    key: 'operate',
    title: '操作'
  }]
  public fetchData = async () => {
    return {}
  }
  public render() {
    return (
      <ListPage
        api={this.fetchData}
        formConfig={getFieldsConfig()}
        formItemLayout={(
          <>
            <FormItem name='withdrawalCode' />
            <FormItem name='supplierName' />
            <FormItem name='supplierId' />
            <FormItem name='supplierType' />
            <FormItem
              name='status'
              label='审核状态'
              type='select'
              options={[{
                label: '全部',
                value: ''
              }, {
                label: '待审核',
                value: '1'
              }, {
                label: '审核通过',
                value: '2'
              }, {
                label: '审核不通过',
                value: '3'
              }]}
            />
            <FormItem
              name='createTime'
              label='创建时间'
              type='rangepicker'
            />
          </>
        )}
        columns={this.columns}
      />
    )
  }
}

export default InvoiceReview