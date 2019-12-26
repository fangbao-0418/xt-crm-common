import React from 'react'
import { Modal } from 'antd'
import { unionBy } from 'lodash'
import { activityType } from '@/enum'
import ListPage from '@/packages/common/components/list-page'
import DateFns from 'date-fns'
import { getPromotionList } from '@/pages/activity/api'
import { getDefaultConfig } from './config'

/** 自定义选中项 */
interface SelectedRowOpts {
  selectedRowKeys: string[] | number[]
  selectedRows: any[]
}
interface Props {
  selectedRowOpts: SelectedRowOpts
  visible: boolean
  onOk: (payload: SelectedRowOpts) => void
  onClose: () => void,
  /** 列表请求参数处理 */
  processPayload?: (payload: any) => any
}
interface State {
  selectedRowOpts: SelectedRowOpts
}

/** 选择活动modal */
class Main extends React.Component<Props, State> {
  public state: State = {
    selectedRowOpts: {
      selectedRowKeys: [],
      selectedRows: []
    }
  }
  public constructor(props: any) {
    super(props)
    this.handleOk = this.handleOk.bind(this)
  }
  /** 让selectedRowOpts受控 */
  public componentWillReceiveProps (nextProps: Props) {
    if (this.props.selectedRowOpts !== nextProps.selectedRowOpts) {
      console.log('componentWillReceiveProps', this.props.selectedRowOpts, nextProps.selectedRowOpts)
      this.setState({
        selectedRowOpts: nextProps.selectedRowOpts
      })
    }
  }
  /** 选择活动列表配置 */
  public columns = [
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
      render: (text: any) => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (text: any) => <>{DateFns.format(text, 'YYYY-MM-DD HH:mm:ss')}</>
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      render: (text: any) => <>{activityType.getValue(text)}</>
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      render: (text: any) => <>{text === 0 ? '关闭' : '开启'}</>
    }
  ]

  public handleOk() {
    const { selectedRowOpts } = this.state
    this.props.onOk(selectedRowOpts)
  }

  public render() {
    const { visible } = this.props
    const { selectedRowOpts } = this.state
    return (
      <Modal
        title="选择活动"
        visible={visible}
        width={1000}
        onCancel={this.props.onClose}
        onOk={this.handleOk}
      >
        <ListPage
          rangeMap={{
            time: {
              fields: ['startTime', 'endTime']
            }
          }}
          columns={this.columns}
          formConfig={getDefaultConfig()}
          processPayload={this.props.processPayload}
          api={getPromotionList}
          tableProps={{
            rowSelection: {
              selectedRowKeys: selectedRowOpts.selectedRowKeys,
              onChange: (selectedRowKeys: string[] | number[], selectedRows: any[]) => {
                selectedRows = unionBy(selectedRowOpts.selectedRows, selectedRows, 'id').filter((item: any) =>
                  selectedRowKeys.some((key: string | number) => item.id === key)
                )
                this.setState({
                  selectedRowOpts: {
                    selectedRowKeys,
                    selectedRows
                  }
                })
              }
            }
          }}
        />
      </Modal>
    )
  }
}

export default Main
