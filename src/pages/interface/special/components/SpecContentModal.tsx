import React from 'react'
import { Button, Modal } from 'antd'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { getDefaultConfig } from '../content/config'
import { queryFloor } from '../content/api'
import { ColumnProps } from 'antd/es/table'

export interface Options {
  visible: boolean
}

interface Props {
  visible: boolean
}
interface FloorProps {
  id: number
  floorName: string
  statusText: string
  status: number
  modifyTime: string
  operator: string
}
class SpecContentModal extends React.Component<Props, any> {
  public list: ListPageInstanceProps
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
  public render () {
    const { visible } = this.props
    return (
      <Modal
        title='选择专题内容'
        visible={visible}
        width='80%'
      >
        <ListPage
          rangeMap={{
            modifyTime: {
              fields: ['startModifyTime', 'endModifyTime']
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
    }
    public state: any = {
      visible: false
    }
    public modal (opts: Options) {
      this.setState({
        visible: opts.visible
      })
    }
    public render () {
      const { visible } = this.state
      return (
        <>
          <SpecContentModal
            visible={visible}
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