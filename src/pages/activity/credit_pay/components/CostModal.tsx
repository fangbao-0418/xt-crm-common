import React from 'react'
import { Modal, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
interface Props {
  visible?: boolean
  dataSource?: any[]
}
type State = Props
class Main extends React.Component<Props, State> {
  public columns: ColumnProps<any>[] = [
    {
      dataIndex: 'A',
      title: ''
    },
    {
      dataIndex: 'A1',
      title: '普通用户'
    },
    {
      dataIndex: 'A2',
      title: '团长'
    },
    {
      dataIndex: 'A3',
      title: '区长'
    },
    {
      dataIndex: 'A4',
      title: '城市合伙人'
    },
    {
      dataIndex: 'A5',
      title: '管理员'
    }
  ]
  public state: State = {
    visible: this.props.visible
  }
  public componentWillReceiveProps (props: State) {
    this.setState({
      dataSource: props.dataSource,
      visible: props.visible
    })
  }
  public render () {
    return (
      <div>
        <Modal
          visible={this.state.visible}
          title='费用查看'
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
          footer={false}
        >
          <Table
            columns={this.columns}
            dataSource={this.state.dataSource}
            pagination={false}
          />
        </Modal>
      </div>
    )
  }
}
export default Main
