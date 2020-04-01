import React, { PureComponent } from 'react'
import { Modal, Form, Table, Input } from 'antd'
import { connect } from '@/util/utils'
import { namespace } from '../model'

const { Search } = Input

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
]

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
]

@connect(state => ({
  activityModal: state[namespace].activityModal
}))
@Form.create()
class ActivityModal extends PureComponent {
  /* 取消模态框操作 */
  handleCancel = () => {
    const { dispatch, activityModal } = this.props
    dispatch[namespace].saveDefault({
      activityModal: {
        ...activityModal,
        visible: false,
      }
    })
  }

  /* 模态框消失之后回调 */
  handleAfterClose = () => {
    const { dispatch, activityModal } = this.props
    dispatch[namespace].saveDefault({
      activityModal: {
        ...activityModal,
        title: '商品查询'
      }
    })
  }

  render() {
    const {
      activityModal
    } = this.props

    return (
      <Modal
        width="60%"
        bodyStyle={{
          paddingBottom: 0
        }}
        title={activityModal.title}
        visible={activityModal.visible}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
      >
        <Search
          placeholder="input search text"
          onSearch={value => console.log(value)}
        />
        <Table size="small" style={{ marginTop: 16 }} dataSource={dataSource} columns={columns} />
      </Modal>
    )
  }
}

export default ActivityModal