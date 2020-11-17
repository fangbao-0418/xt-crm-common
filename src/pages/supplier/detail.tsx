import React from 'react'
import ListPage from '@/packages/common/components/list-page'
import { Tabs, Card, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table';
import Modal from 'antd/es/modal';
import { parseQuery } from '@/util/utils';
import { getErpInfo } from './api';

enum erpStatusEnum {
  未对接 = 0,
  已绑定 = 1
}
const { TabPane } = Tabs
interface Log {
  operate: string
  content: string
  operator: string
}

interface State {
  detail: Partial<{
    erpStatus: 0 | 1
    erpType: '0' | '1' | '2' // ERP类型(0:无,1:网店管家,2:旺店通)
    erpTypeDesc: 0 | 1 | 2 // ERP类型(0:无,1:网店管家,2:旺店通)
    erpKey: '0' | '1' // ERP对接状态(0:未对接,1:已绑定)
  }>
}
class Main extends React.Component<{}, State> {
  public state: State = {
    detail: {}
  }
  public componentDidMount () {
    this.getErpInfo()
  }
  public async getErpInfo() {
    const { shopId } = parseQuery() as any
    console.log('shopId', shopId)
    const res = await getErpInfo(shopId)
    this.setState({ detail: res })
  }
  public columns: ColumnProps<Log>[] = [{
    title: '操作',
    dataIndex: 'operate'
  }, {
    title: '内容',
    dataIndex: 'content'
  }, {
    title: '操作人',
    dataIndex: 'operator'
  }]
  public handleChange = () => {}
  public unbind = () => {
    Modal.confirm({
      title: '确认解绑？',
      content: '解绑将关闭供应商ERP对接',
      cancelText: '取消',
      okText: '确认'
    })
  }
  public render () {
    const { detail } = this.state
    return (
      <Card>
        <Tabs
          defaultActiveKey="1"
          onChange={this.handleChange}
        >
          <TabPane tab="接入详情" key="1">
            <div>
              <span className='mr10'>供应商ERP对接状态：{detail.erpStatus && erpStatusEnum[detail.erpStatus]}</span>
              <Button type='primary' onClick={this.unbind}>解绑</Button>
            </div>
            <div>密钥：-</div>
            <div>供应商使用ERP系统：-</div>
          </TabPane>
          <TabPane tab="信息记录" key="2">
            <ListPage columns={this.columns} />
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default Main