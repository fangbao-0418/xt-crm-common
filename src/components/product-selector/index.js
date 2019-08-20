import React, { useState, useEffect } from 'react';
import { Modal, Input, Table } from 'antd';
import { formatMoneyWithSign } from '../../pages/helper';
import { isFunction } from 'lodash';
import Image from '@/components/Image';
import { getProductList } from './api';
const goodsColumns = (data = []) => {
  return [
    {
      title: '序号',
      render: (text, row, index) => {
        return index + 1;
      },
      width: 60,
    },
    {
      title: '商品ID',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      width: 200,
    },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      width: 60,
      render: text => <Image style={{ height: 60, width: 60 }} src={text} alt="主图" />
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      render: text => <>{formatMoneyWithSign(text)}</>,
    },
    {
      title: '市场价',
      dataIndex: 'marketPrice',
      render: text => <>{formatMoneyWithSign(text)}</>,
    },
    {
      title: '销售价',
      dataIndex: 'salePrice',
      render: text => <>{formatMoneyWithSign(text)}</>,
    },
    ...data,
  ];
};
function ProductSelector({ visible, onCancel, onChange }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [goodsList, setGoodsList] = useState([]);
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
      const res = await getProductList({
        status: 0,
        pageSize: modalPage.pageSize,
        page: modalPage.current,
        ...params
      })
      setLoading(false)
      setGoodsList(res.records)
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
      title="选择商品"
      visible={visible}
      width={800}
      onCancel={handleCancel}
      onOk={handleOkModal}
    >
      <Input.Search
        placeholder="请输入需要搜索的商品"
        style={{ marginBottom: 10 }}
        onSearch={handleSearchModal}
      />
      <Table
        loading={loading}
        rowSelection={rowSelection}
        columns={goodsColumns()}
        dataSource={goodsList}
        pagination={modalPage}
        onChange={handleTabChangeModal}
        rowKey={record => record.id}
      />
    </Modal>
  )
}
export default ProductSelector;