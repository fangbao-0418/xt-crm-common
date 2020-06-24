/**
 * 外部账户余额查询-供应商
 */
import React from 'react'
import { ListPage, Alert, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { AlertComponentProps } from '@/packages/common/components/alert'
import { Tag, Popconfirm, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { getFieldsConfig, AnchorLevelEnum, AnchorIdentityTypeEnum } from './config'
import * as api from './api'
interface Props extends AlertComponentProps {
}
class Main extends React.Component<Props> {
  public listpage: ListPageInstanceProps
  public columns: ColumnProps<Anchor.ItemProps>[] = [{
    title: '商家ID',
    dataIndex: 'supplierId',
    width: 300
  }, {
    title: '商家名称',
    dataIndex: 'supplierName',
    width: 200,
    align: 'center'
  }, {
    dataIndex: 'supplierType',
    title: '商家类型',
    width: 150
  }, {
    dataIndex: 'balanceMoney',
    title: '商家余额（元）',
    width: 120,
    align: 'center'
  }, {
    dataIndex: 'queryBalanceQueryTime',
    title: '更新日期',
    width: 100
  }]
  public refresh () {
    this.listpage.refresh()
  }
  public render () {
    return (
      <div
        style={{
          background: '#FFFFFF'
        }}
      >
        <ListPage
          getInstance={(ref) => this.listpage = ref}
          columns={this.columns}
          tableProps={{
            rowKey: 'supperId'
          }}
          formConfig={getFieldsConfig()}
          formItemLayout={(
            <>
              <FormItem name='supperId' />
            </>
          )}
          api={api.supplierBalance}
        />
      </div>
    )
  }
}
export default Alert(Main)
