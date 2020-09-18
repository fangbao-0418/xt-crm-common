import React from 'react'
import { ListPage, FormItem } from '@/packages/common/components'
import { ColumnProps } from 'antd/lib/table'
import { getDefaultConfig } from './config'
import { getShopList } from './api'
import { unionBy } from 'lodash'
import { Modal } from 'antd'
interface Props {
  selectedRowKeys: string[] | number[]
  onOk: (dataSource: any[]) => void
}
interface State {
  selectedRowKeys: string[] | number[],
  visible: boolean
}
class Main extends React.Component<Props, State> {
  public state = {
    selectedRowKeys: [],
    visible: false
  }
  public componentWillReceiveProps(nextPorps: Props) {
    const selectedRowKeys = nextPorps.selectedRowKeys
    if (selectedRowKeys && this.props.selectedRowKeys !== selectedRowKeys) {
      this.setState({ selectedRowKeys })
    }
  }
  public rows: any[] = []
  public columns: ColumnProps<any>[] = [{
    title: '店铺id',
    dataIndex: 'shopId'
  }, {
    title: '店铺名称',
    dataIndex: 'shopName'
  }, {
    title: '店铺状态',
    dataIndex: 'shopStatusLabel'
  }, {
    title: '店铺主营类目',
    dataIndex: 'mainProductCategoryName'
  }]
  public onOk = () => {
    this.props.onOk(this.rows)
    this.onCancel()
  }
  public open = () => {
    this.setState({ visible: true })
  }
  public onCancel = () => {
    this.setState({ visible: false })
  }
  public render () {
    const { selectedRowKeys, visible } = this.state
    return (
      <Modal
        title='选择店铺'
        width={1200}
        onOk={this.onOk}
        onCancel={this.onCancel}
        visible={visible}
      >
        <ListPage
          processPayload={(payload) => {
            payload.bizType = 2
            payload.shopStatusList = [2]
            if (payload.shopId) {
              payload.shopIdList = [payload.shopId]
            }
            return payload
          }}
          columns={this.columns}
          api={getShopList}
          formConfig={getDefaultConfig()}
          namespace='addFormConfig'
          formItemLayout={(
            <>
              <FormItem name='shopId' />
              <FormItem name='shopName' />
            </>
          )}
          tableProps={{
            rowKey: 'shopId',
            rowSelection: {
              selectedRowKeys,
              onChange: (keys: any[], rows: any[]) => {
                this.rows = unionBy(this.rows, rows, x => x.shopId).filter((v: any) => keys.includes(v.shopId))
                this.setState({ selectedRowKeys: keys })
              }
            }
          }}
        />
      </Modal>
    )
  }
}

export default Main