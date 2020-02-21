import React from 'react';
import { Modal, Table } from 'antd';

interface ProductSeletorProps {
  visible: boolean;
  dataSource: any[];
  onCancel: () => void;
  onOK: (value: any) => void;
}

interface ProductSeletorState {
  selectedRowKeys: any[]
}
class ProductSeletor extends React.Component<ProductSeletorProps, ProductSeletorState> {
  state = {
    selectedRowKeys: []
  }
  columns = [{
    title: '商品ID',
    dataIndex: 'productBasicId'
  }, {
    title: '商品名称',
    dataIndex: 'productBasicName'
  }, {
    title: '规格名',
    dataIndex: 'productBasicSpuCode'
  }, {
    title: '规格条码',
    dataIndex: 'productBasicBarCode'
  }, {
    title: '锁定库存数量',
    dataIndex: 'stock'
  }]
  handleOK = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length < 1) {
      APP.error('请选择商品');
    }
    this.props.onOK(selectedRowKeys[0])
  }
  render() {
    const { visible, dataSource } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <Modal
        width={800}
        title='请选择商品'
        visible={visible}
        onCancel={this.props.onCancel}
        onOk={this.handleOK}
      >
        <Table
          rowKey='productBasicId'
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: (selectedRowKeys) => {
              this.setState({
                selectedRowKeys
              })
            }
          }}
          dataSource={dataSource}
          columns={this.columns}
        />
      </Modal>
    )
  }
}

export default ProductSeletor;