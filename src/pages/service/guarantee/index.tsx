import React from 'react'
import { Card, Modal, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { Alert } from 'antd'
import Detail from './Detail'

interface State {
  visible: boolean
}
class Main extends React.Component<{}, State> {
  public state = {
    visible: false
  }
  public columns: ColumnProps<unknown>[] = [{
    title: '服务名称',
    dataIndex: 'name'
  }, {
    title: '服务内容',
    dataIndex: 'content'
  }, {
    title: '排序',
    dataIndex: 'sort'
  }, {
    title: '操作',
    render: () => {
      return (
        <>
          <span className='href' onClick={this.handleEdit}>编辑</span>
        </>
      )
    }
  }]
  public dataSource = [{
    name: '正品保障',
    content: '杭州市西湖区古荡湾',
    sort: 7
  }]
  public handleEdit = () => {
    this.setState({
      visible: true
    })
  }
  public onCancel = () => {
    this.setState({ visible: false })
  }
  public render () {
    const { visible } = this.state
    return (
      <Card>
        <Modal title='编辑服务保障' visible={visible} onCancel={this.onCancel}>
          <Detail />
        </Modal>
        <Alert
          message="显示在商品详情页面的服务保障，正品保障，品质优选，全场包邮，运费险为平台自营+pop店商品详情共用，"
          description={<span style={{ color: 'red' }}>参加拦截的商品不支持运费险</span>}
          type="warning"
          showIcon
        />
        <Table className='mt10' columns={this.columns} dataSource={this.dataSource}/>
      </Card>
    )
  }
}

export default Main