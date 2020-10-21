/**
 * 外部账户余额查询-供应商
 */
import React from 'react'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, SupplierTypeEnum } from '../config'
import * as api from '../api'
import MultiSearch from './MultiSearch'
import { SupplierBalanceProfile } from '../interface'
import Page from '@/components/page'
import MoneyText from '@/components/money-text'

interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<SupplierBalanceProfile>[] = [{
    title: '商家ID',
    dataIndex: 'supplierId',
    width: 80
  }, {
    title: '供应商名称',
    dataIndex: 'supplierName',
    width: 150
  }, {
    dataIndex: 'supplierTypeDesc',
    title: '商家类型',
    width: 180
  }, {
    dataIndex: 'cashableAmount',
    title: '可提现余额',
    width: 120,
    render: (text) => <MoneyText value={text} />
  }, {
    dataIndex: 'unsettledAmount',
    title: '待结算金额',
    width: 120,
    render: (text) => <MoneyText value={text} />
  }, {
    dataIndex: 'frozenAmount',
    title: '冻结金额',
    width: 120,
    render: (text) => <MoneyText value={text} />
  }, {
    dataIndex: 'presentedAmount',
    title: '已提现金额',
    width: 120,
    render: (text) => <MoneyText value={text} />
  }]
  public refresh () {
    this.listpage.refresh()
  }
  public render () {
    return (
      <Page>
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          style={{
            padding: 0
          }}
          columns={this.columns}
          tableProps={{
            rowKey: 'supplierId'
          }}
          processPayload={(payload) => {
            const supplier = payload?.supplier
            return {
              ...payload,
              supplier: undefined,
              subjectId: supplier?.type === 'id' ? supplier?.value : undefined,
              subjectName: supplier?.type === 'name' ? supplier?.value : undefined
            }
          }}
          autoFetch={false}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='subjectType' />
              <FormItem
                label='供应商'
                inner={(form) => {
                  return form.getFieldDecorator('supplier')(
                    <MultiSearch />
                  )
                }}
              />
            </>
          )}
          api={api.supplierBalance}
        />
      </Page>
    )
  }
}
export default Alert(Main)
