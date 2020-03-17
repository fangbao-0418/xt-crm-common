import React from 'react';
import { Modal, Table, InputNumber } from 'antd';
import { getSkusStock, postSkusStockEdit } from "../../api";

interface SkuStockEditProps {
  visible: boolean;
  id: number;
  name: string;
  onCancel: () => void;
  onOK: () => void;
}

interface SkuStockEditState {
  editSkus: any,
  dataSource: any[],
}
class SkuStockEdit extends React.Component<SkuStockEditProps, SkuStockEditState> {
  state = {
    editSkus: {},
    dataSource: []
  }

  async componentDidUpdate(prevProps:SkuStockEditProps) {
    const { id, visible } = this.props
    if (visible && visible !== prevProps.visible) {
      this.setState({
        editSkus: {},
        dataSource: []
      })
      if (id) {
        const res = await getSkusStock(id)
        this.setState({
          dataSource: res.skuStockList
        })
      }
    }
  }

  updateEditSkus = (stock:any, skuId:number) => {
    let { editSkus } = this.state
    this.setState({
      editSkus: {
        ...editSkus,
        [skuId]: stock
      }
    })
    console.log('updateEditSkus', stock, skuId)
  }

  getColumns = () => {
    const { editSkus } = this.state
    const columns = [{
      title: '规格',
      width: 100,
      dataIndex: 'property'
    }, {
      title: '总库存',
      width: 100,
      dataIndex: 'stock'
    }, {
      title: '锁定库存',
      width: 100,
      dataIndex: 'lockStock'
    }, {
      title: '可用库存',
      width: 100,
      dataIndex: 'usableStock'
    },{
      title: '加减可用库存',
      width: 100,
      render: (text: any, record: any, index: any) => (
        <InputNumber
          precision={0}
          value={(editSkus as any)[record.skuId] || 0}
          onChange={(value:any) => this.updateEditSkus(value, record.skuId)}
        />
      )
    }]
    return columns
  }
  handleOK = () => {
    const { id } = this.props
    const { editSkus } = this.state
    postSkusStockEdit({
      productId: id,
      skuStockList: Object.keys(editSkus).map(key => ({
        skuId: Number(key),
        stock: (editSkus as any)[key]
      }))
    }).then(() => {
      this.props.onOK()
    })
  }
  handleCancel = () => {
    this.props.onCancel()
  }
  render() {
    const { visible, id, name } = this.props;
    const { dataSource } = this.state
    return (
      <Modal
        width={800}
        title={`编辑库存 -- 商品id: ${id} -- 商品名称: ${name}`}
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleOK}
        style={{top: '5vh'}}
        >
        <Table
          scroll={{ y: '60vh' }}
          dataSource={dataSource}
          columns={this.getColumns()}
          pagination={false}
        />
      </Modal>
    )
  }
}

export default SkuStockEdit;
