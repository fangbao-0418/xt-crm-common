import React from 'react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form';
import { PaginationConfig } from 'antd/lib/pagination'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert';
import { CSkuProps } from '.';

interface CSkuTableProps extends Partial<AlertComponentProps>, FormComponentProps {
  extraColumns?: ColumnProps<any>[];
  dataSource: CSkuProps[];
}
interface CSkuTableState {
  dataSource: CSkuProps[]
}
class CSkuTable extends React.Component<CSkuTableProps, CSkuTableState> {
  pagination: PaginationConfig = {
    current: 1,
    pageSize: 10
  }
  columns = [{
    title: '规格条码',
    dataIndex: 'skuBarCode',
    key: 'skuBarCode'
  }, {
    title: '规格编码',
    dataIndex: 'skuCode',
    key: 'skuCode'
  }, {
    title: '市场价',
    dataIndex: 'marketPrice',
    key: 'marketPrice'
  }, {
    title: '成本价',
    dataIndex: 'costPrice',
    key: 'costPrice'
  }, {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock'
  }]
  constructor(props: CSkuTableProps) {
    super(props);
    this.state = {
      dataSource: props.dataSource
    }
  }
  componentWillReceiveProps (props: CSkuTableProps) {
    this.setState({
      dataSource: props.dataSource
    })
  }
  // 快速输入
  speedyInput(field: string, text: any, record: CSkuProps, index: number, dataSource: CSkuProps[], cb?: any) {
    const { pageSize = 10, current = 1 } = this.pagination
  }
  render() {
    const { dataSource } = this.state;
    console.log('dataSource =>', dataSource);
    const columns = (this.props.extraColumns || []).concat(this.columns);
    return (
      <Table
        rowKey='id'
        title={() => '规格明细'}
        columns={columns}
        dataSource={dataSource}
      />
    );
  }
}

export default Alert(CSkuTable);