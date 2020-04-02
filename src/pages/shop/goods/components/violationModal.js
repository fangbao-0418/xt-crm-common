import React, { Component } from 'react';
import { Modal } from 'antd';
import moment from 'moment';
import CommonTable from '@/components/common-table';
import { getOperateList } from '../api'


function formatTime(text) {
  return text ? moment(text).format('YYYY-MM-DD HH:mm:ss'): '-';
}

const columns = [
  {
    title: '编号',
    dataIndex: 'index',
    key: 'index'
  },
  {
    title: '下架时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: formatTime
  },
  {
    title: '操作人',
    dataIndex: 'createUser',
    key: 'createUser'
  },
  {
    title: '下架原因',
    dataIndex: 'info',
    key: 'info'
  }
];
class ViolationModal extends Component {

  state = {
    visible: false,
    violationData: {
      records: [],
      current: 1,
      size: 0,
      pages: 10,
      total: 0
    }
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
      this.setState({
        violationData: {
          ...res,
          records: res.records.map((item, i) => ({
            ...item,
            index: (res.current - 1) * res.size + i + 1
          }))
        }
      })
    })
  }

  handleChange = (params) => {
    const { currentGoods } = this.props;
    this.fetchData({
      ...params,
      productPoolId: currentGoods.id
    })
  }

  render() {
    const { visible, violationData } = this.state;

    const { currentGoods } = this.props

    if (!currentGoods) return null;

    return (
      <Modal
        width={'60%'}
        visible={visible}
        footer={null}
        title={`商品【${currentGoods.productName}】的图片`}
        onCancel={this.handleCancel}
        afterClose={this.handleClose}
        destroyOnClose
      >
        <CommonTable
          columns={columns}
          dataSource={violationData.records || []}
          onChange={this.handleChange}
          total={violationData.total}
          current={violationData.current}
        />
      </Modal>
    )
  }
}

export default ViolationModal