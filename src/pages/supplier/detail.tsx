import React from 'react'
import { Tabs, Card, Button, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table';
import Modal from 'antd/es/modal';
import { parseQuery } from '@/util/utils';
import { getErpInfo, getErpRecords, unBind } from './api';

enum erpStatusEnum {
  未绑定 = 0,
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
    erpTypeDesc: string
    erpKey: '0' | '1' // ERP对接状态(0:未对接,1:已绑定)
  }>,
  records: any[]
}
class Main extends React.Component<{}, State> {
  public shopId = (parseQuery() as any).shopId
  public state: State = {
    detail: {},
    records: []
  }
  public componentDidMount () {
    this.getErpInfo();
    this.getErpRecords();
  }
  public async getErpRecords () {
    const res = await getErpRecords(this.shopId)
    this.setState({ records: res })
  }
  public async getErpInfo() {
    const res = await getErpInfo(this.shopId)
    this.setState({ detail: res })
  }
  public columns: ColumnProps<Log>[] = [{
    title: '操作',
    dataIndex: 'clientFrom'
  }, {
    title: '内容',
    dataIndex: 'operateDesc'
  }, {
    title: '操作人',
    dataIndex: 'createUserName'
  }]
  public handleChange = () => {}
  public unbind = () => {
    Modal.confirm({
      title: '确认解绑？',
      content: '解绑将关闭供应商ERP对接',
      cancelText: '取消',
      okText: '确认',
      onOk: async () => {
        const res = await unBind({
          shopId: this.shopId,
          erpType: this.state.detail.erpType
        })
        if (res) {
          APP.success('操作成功')
          this.getErpInfo();
          this.getErpRecords();
        }
      }
    })
  }
  public render () {
    const { detail, records } = this.state
    return (
      <Card>
        <Tabs
          defaultActiveKey="1"
          onChange={this.handleChange}
        >
          <TabPane tab="接入详情" key="1">
            <div>
              <span className='mr10'>供应商ERP对接状态：{detail.erpStatus !== undefined && erpStatusEnum[detail.erpStatus]}</span>
              {detail.erpStatus === 1 && <Button type='primary' onClick={this.unbind}>解绑</Button>}
            </div>
            <div>密钥：{detail.erpKey || '-'}</div>
            <div>供应商使用ERP系统：{detail.erpTypeDesc || '-'}</div>
          </TabPane>
          <TabPane tab="信息记录" key="2">
            <Table
              dataSource={records}
              columns={this.columns}
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>
    )
  }
}

export default Main