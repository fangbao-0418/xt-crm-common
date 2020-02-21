import React from 'react';
import { Table } from 'antd';
import ListPage from '@/packages/common/components/list-page';
import { FormItem, SelectFetch } from '@/packages/common/components';
import { defaultConfig } from './config';
import { Modal } from 'antd';
import { unionBy } from 'lodash';
import { getCategoryTopList } from '../../api';
import { CSkuProps } from '../../sku-stock/components/sku';
import { getBaseProductPage } from '../../sku-sale/api';
interface ProductSelectorProps {
  visible: boolean;
  onCancel: ()=> void;
  dataSource?: any[];
  onOk: (selectedRowKeys: string[] | number[], selectedRows: any[]) => void;
}
interface ProductSelectorState {
  selectedRowKeys: any[]
}
class ProductSelector extends React.Component<ProductSelectorProps, ProductSelectorState> {
  state: ProductSelectorState = {
    selectedRowKeys: []
  }
  seletedRows: any[] = [];
  columns = [{
    title: 'id',
    width: 80,
    align: 'center',
    dataIndex: 'id'
  }, {
    title: '商品',
    width: 150,
    align: 'center',
    dataIndex: 'productName'
  }, {
    title: '状态',
    width: 100,
    align: 'center',
    dataIndex: 'statusText'
  }, {
    title: '类目',
    width: 200,
    align: 'center',
    dataIndex: 'categoryName'
  }, {
    title: '规格详情',
    dataIndex: 'productBasicSkuInfos',
    align: 'center',
    render: (data: CSkuProps[]) => {
      return (
        <Table
          rowKey='productBasicSkuId'
          pagination={false}
          columns={[{
            title: '规格',
            dataIndex: 'propertyValue'
          }, {
            title: '市场价',
            dataIndex: 'marketPrice'
          }, {
            title: '成本价',
            dataIndex: 'costPrice'
          }, {
            title: '总库存',
            dataIndex: 'totalStock'
          }]}
          dataSource={data}
        />
      );
    }
  }]
  handleOK = () => {
    const { selectedRowKeys } = this.state;
    this.props.onOk(selectedRowKeys, this.seletedRows);
  }
  render() {
    const { selectedRowKeys } = this.state;
    const { visible, onCancel } = this.props;
    return (
      <Modal
        title='请选择商品'
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleOK}
        width='70%'
      >
        <ListPage
          namespace='productSelector'
          formConfig={defaultConfig}
          tableProps={{
            rowSelection: {
              selectedRowKeys,
              onChange: (selectedRowKeys: string[] | number[], selectedRows: any[]) => {
                // fix ant-design bug
                const unionArray: any[] = unionBy(this.seletedRows, selectedRows, x => x.id)
                this.seletedRows = unionArray.filter(x => selectedRowKeys.includes(x.id as never));
                this.setState({ selectedRowKeys });
              }
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='id' />
              <FormItem name='productName' />
              <FormItem name='status' />
              <FormItem
                label='类目'
                inner={(form) => {
                  return form.getFieldDecorator('categoryId')(
                    <SelectFetch
                      style={{ width: 172 }}
                      fetchData={getCategoryTopList}
                    />
                  )
                }}
              />
            </>
          )}
          columns={this.columns}
          api={getBaseProductPage}
        />
      </Modal>
    );
  }
}

export default ProductSelector;