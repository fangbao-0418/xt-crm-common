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
  goodsModal: state[namespace].goodsModal
}))
@Form.create()
class GoodsModal extends PureComponent {
  /* 取消模态框操作 */
  handleCancel = () => {
    const { dispatch, goodsModal } = this.props
    dispatch[namespace].saveDefault({
      goodsModal: {
        ...goodsModal,
        visible: false,
      }
    })
  }

  /* 模态框消失之后回调 */
  handleAfterClose = () => {
    const { dispatch, goodsModal } = this.props
    dispatch[namespace].saveDefault({
      goodsModal: {
        ...goodsModal,
        title: '商品查询'
      }
    })
  }

  render() {
    const {
      goodsModal
    } = this.props

    return (
      <Modal
        width="60%"
        title={goodsModal.title}
        visible={goodsModal.visible}
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

export default GoodsModal