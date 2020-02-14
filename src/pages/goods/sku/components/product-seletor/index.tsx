import React from 'react';
import { Modal, Table } from 'antd';

interface ProductSeletorProps {
  visible: boolean;
}

class ProductSeletor extends React.Component<ProductSeletorProps, any> {
  state = {
    selectedRowKeys: []
  }
  columns = [{
    title: '商品ID',
    dataIndex: 'productId'
  }, {
    title: '商品名称',
    dataIndex: 'productName'
  }, {
    title: '锁定规格',
    dataIndex: 'skuName'
  }, {
    title: '锁定库存数量',
    dataIndex: 'stock'
  }]
  render() {
    const { visible } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <Modal
        title='请选择商品'
        visible={visible}
      >
        <Table
          rowSelection={{
            selectedRowKeys
          }}
          columns={this.columns}
        />
      </Modal>
    )
  }
}

export default ProductSeletor;