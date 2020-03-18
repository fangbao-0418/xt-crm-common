import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import { getOperateList } from '../api'

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
];

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
];
class ViolationModal extends Component {

  state = {
    visible: false
  }

  /** 隐藏模态框 */
  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  /** 显示模态框 */
  showModal = () => {
    this.setState({
      visible: true
    })
  }

  /** 取消操作 */
  handleCancel = () => {
    this.hideModal()
  }

  /** 窗口彻底关闭回调 */
  handleClose = () => {
    this.props.ondestroy();
  }

  fetchData = (data) => {
    getOperateList(data).then(res => {
      console.log(res)
    })
  }

  render() {
    const { visible } = this.state;

    const { currentGoods } = this.props

    if (!currentGoods) return null;

    return (
      <Modal
        visible={visible}
        footer={null}
        title={`商品【${currentGoods.productName}】的图片`}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
      >
        <Table 
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </Modal>
    )
  }
}

export default ViolationModal