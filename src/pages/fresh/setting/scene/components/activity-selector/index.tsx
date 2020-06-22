import React from 'react'
import { Modal } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import ListPage from '@/packages/common/components/list-page'
import AntTableRowSelection from '@/util/AntTableRowSelection'
import * as api from './api'

interface State {
  visible: boolean
  selectedRowKeys: any[]
  selectedRows: any[]
}

interface Props {
  getInstance?: (ref: Main) => void
  onOk?: (keys: any, rows: any[]) => void
}

class Main extends AntTableRowSelection<Props, State, any> {
  public columns: ColumnProps<any>[] = [
    {
      title: '活动ID',
      dataIndex: 'id',
      width: 100
    },
    {
      title: '活动名称',
      dataIndex: 'title'
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: text => APP.fn.formatDate(text)
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: text => APP.fn.formatDate(text)
    },
    {
      title: '活动类型',
      dataIndex: 'type'
      // render: text => (
      //   <>
      //     {activityType.getValue(text)}
      //   </>
      // )
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: text => <>{text === 0 ? '关闭' : '开启'}</>
    }
  ]
  public rowSelectionKey = 'id'
  public componentDidMount () {
    this.props?.getInstance?.(this)
  }
  public state: State = {
    visible: false,
    selectedRowKeys: [],
    selectedRows: []
  }
  public open (rows: any[] = []) {
    console.log(rows, 'rows')
    this.selectedRows = rows
    // api.fetchPromotionList({}).then(() => {
    //   //
    // })
    this.setState({
      selectedRowKeys: rows.map((item) => item.id),
      visible: true
    })
  }
  public render () {
    return (
      <Modal
        width={1000}
        title='选择活动'
        visible={this.state.visible}
        onCancel={() => {
          this.setState({
            visible: false
          })
        }}
        onOk={() => {
          this.props?.onOk?.(this.state.selectedRowKeys, this.selectedRows)
          this.setState({
            visible: false
          })
        }}
      >
        <ListPage
          columns={this.columns}
          api={api.fetchPromotionList}
          tableProps={{
            rowKey: 'id',
            // dataSource: this.props.dataSource,
            rowSelection: this.rowSelection
          }}
        />
      </Modal>
    )
  }
}
export default Main
