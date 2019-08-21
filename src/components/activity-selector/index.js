import React, { useState, useEffect } from 'react';
import { Modal, Input, Table } from 'antd';
import { isFunction } from 'lodash';
import { getPromotionList } from './api';
import { actColumns } from './config';

function ProductSelector({ visible, onCancel, onChange }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [actList, setActList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalPage, setModalPage] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
  })
  const handleTabChangeModal = pagination => {
    setModalPage(pagination)
  };
  const fetchData = async (params) => {
    try {
      setLoading(true)
      const res = await getPromotionList({
        page: modalPage.current,
        pageSize: modalPage.pageSize,
        ...params
      })
      setLoading(false);
      setModalPage({
        ...modalPage,
        total: res.total
      });
      setActList(res.records);
    } catch (err) {
      setLoading(true)
    }
  }
  const handleSearchModal = (val) => {
    fetchData({ productName: val.trim(), page: 1 })
  }
  const handleCancel = () => {
    isFunction(onCancel) && onCancel();
  }
  const handleOkModal = () => {
    isFunction(onChange) && onChange(selectedRowKeys, selectedRows)
    handleCancel()
  }
  useEffect(() => {
    fetchData();
  }, [])
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys=>', selectedRowKeys);
      console.log('selectedRows=>', selectedRows);
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    }
  }
  return (
    <Modal
      title="选择活动"
      visible={visible}
      width={800}
      onCancel={handleCancel}
      onOk={handleOkModal}
    >
      <Input.Search
        placeholder="请输入需要搜索的活动"
        style={{ marginBottom: 10 }}
        onSearch={handleSearchModal}
      />
      <Table
        loading={loading}
        rowSelection={rowSelection}
        columns={actColumns()}
        dataSource={actList}
        pagination={modalPage}
        onChange={handleTabChangeModal}
        rowKey={record => record.id}
      />
    </Modal>
  )
}
export default ProductSelector;