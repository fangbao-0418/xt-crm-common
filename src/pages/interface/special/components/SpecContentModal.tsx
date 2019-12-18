import React from 'react'
import { Button, Modal } from 'antd'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { getDefaultConfig } from '../content/config'
import { queryFloor } from '../content/api'
import { ColumnProps } from 'antd/es/table'

export interface Options {
  visible: boolean,
  floorId: number,
  cb: (res: any, hide: () => void) => void
}
interface Props {
  visible: boolean,
  selectedRowKeys: string[] | number[]
  onCancel: () => void
  onOk: (rowSelectionOpts: RowSelectionOpts) => void
}
interface FloorProps {
  id: number
  floorName: string
  statusText: string
  status: number
  modifyTime: string
  operator: string
}
interface RowSelectionOpts {
  selectedRowKeys: string[] | number[],
  selectedRows: any[]
}
interface State {
  selectedRowKeys: string[] | number[]
}
class SpecContentModal extends React.Component<Props, State> {
  public list: ListPageInstanceProps
  public state: State = {
    selectedRowKeys: []
  }
  public columns: ColumnProps<FloorProps>[] = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id'
    },
    {
      title: '名称',
      key: 'floorName',
      dataIndex: 'floorName'
    },
    {
      title: '启用状态',
      key: 'statusText',
      dataIndex: 'statusText'
    },
    {
      title: '操作时间',
      key: 'modifyTime',
      dataIndex: 'modifyTime'
    },
    {
      title: '最后操作人',
      key: 'operator',
      dataIndex: 'operator'
    }
  ]
  public constructor (props: Props) {
    super(props)
    this.handleOk = this.handleOk.bind(this)
    this.handleSelectionChange = this.handleSelectionChange.bind(this)
  }
  public componentWillReceiveProps ({ selectedRowKeys }: Props) {
    if (this.state.selectedRowKeys !== selectedRowKeys) {
      this.setState({ selectedRowKeys })
    }
  }
  public rowSelectionOpts: RowSelectionOpts = {
    selectedRowKeys: [],
    selectedRows: []
  }
  public handleSelectionChange (selectedRowKeys: string[] | number[], selectedRows: any[]) {
    console.log('before onOk ', this.rowSelectionOpts)
    this.rowSelectionOpts = {
      selectedRowKeys,
      selectedRows
    }
    this.setState({
      selectedRowKeys
    })
  }
  public handleOk () {
    console.log('after onOk ', this.rowSelectionOpts)
    this.props.onOk(this.rowSelectionOpts)
  }
  public render () {
    const { visible } = this.props
    const { selectedRowKeys } = this.state
    return (
      <Modal
        title='选择专题内容'
        visible={visible}
        onCancel={this.props.onCancel}
        onOk={this.handleOk}
        width='80%'
      >
        <ListPage
          rangeMap={{
            modifyTime: {
              fields: ['startModifyTime', 'endModifyTime']
            }
          }}
          tableProps={{
            rowSelection: {
              type: 'radio',
              selectedRowKeys,
              onChange: this.handleSelectionChange
            }
          }}
          getInstance={ref => this.list = ref}
          formConfig={getDefaultConfig()}
          columns={this.columns}
          api={queryFloor}
        />
      </Modal>
    )
  }
}


/** modal高阶组件 */
function withModal (WrappedComponent: any): any {
  return class extends React.Component {
    public constructor (props: any) {
      super(props)
      this.modal = this.modal.bind(this)
      this.handleCancel = this.handleCancel.bind(this)
    }
    public state: any = {
      visible: false,
      floorId: -1 // 占位
    }
    public handleOk: (res: any) => void
    public modal ({ visible, floorId, cb }: Options) {
      this.handleOk = (rowSelectionOpts: RowSelectionOpts) => {
        cb(this.handleCancel, rowSelectionOpts.selectedRows[0])
      }
      this.setState({
        visible,
        floorId
      })
    }
    public handleCancel () {
      this.setState({
        visible: false
      })
    }
    public render () {
      const { visible } = this.state
      return (
        <>
          <SpecContentModal
            visible={visible}
            selectedRowKeys={[this.state.floorId]}
            onCancel={this.handleCancel}
            onOk={this.handleOk}
          />
          <WrappedComponent
            modal={this.modal}
            {...this.props}
          />
        </>
      )
    }
  }
}

export default withModal