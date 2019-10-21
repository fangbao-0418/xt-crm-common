import React from 'react'
import { Modal, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
interface Props {
  visible?: boolean
  dataSource?: any[]
  onCancel?: () => void
}
type State = Props
class Main extends React.Component<Props, State> {
  public columns: ColumnProps<any>[] = [
    {
      dataIndex: 'title',
      title: '',
      width: 120,
      align: 'center'
    },
    {
      dataIndex: 'generalUser',
      title: '普通用户',
      align: 'center'
    },
    {
      dataIndex: 'head',
      title: '团长',
      align: 'center'
    },
    {
      dataIndex: 'areaMember',
      title: '区长',
      align: 'center'
    },
    {
      dataIndex: 'cityMember',
      title: '城市合伙人',
      align: 'center'
    },
    {
      dataIndex: 'managerMember',
      title: '管理员',
      align: 'center'
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
          width={1000}
          visible={this.state.visible}
          title='费用查看'
          onCancel={() => {
            this.setState({
              visible: false
            })
            if (this.props.onCancel) {
              this.props.onCancel()
            }
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
