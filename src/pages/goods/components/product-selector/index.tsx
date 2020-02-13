import React from 'react';
import { Table } from 'antd';
import ListPage from '@/packages/common/components/list-page';
import { FormItem, SelectFetch } from '@/packages/common/components';
import { defaultConfig } from './config';
import { Modal } from 'antd';
import { getCategoryTopList } from '../../api';
import { CSkuProps } from '../../csku/components/sku';
interface ProductSelectorProps {
  visible: boolean
}
class ProductSelector extends React.Component<ProductSelectorProps, any> {
  columns = [{
    title: 'id',
    dataIndex: 'id'
  }, {
    title: '商品',
    dataIndex: 'productName'
  }, {
    title: '状态',
    dataIndex: 'status'
  }, {
    title: '类目',
    dataIndex: 'categoryName'
  }, {
    title: '规格详情',
    dataIndex: 'skuAddList',
    render: (data: CSkuProps[]) => {
      return (
        <Table
          columns={[{
            title: '规格',
            dataIndex: 'skuName'
          }, {
            title: '市场价',
            dataIndex: 'marketPrice'
          }, {
            title: '成本价',
            dataIndex: 'costPrice'
          }, {
            title: '总库存',
            dataIndex: 'stock'
          }]}
          dataSource={data}
        />
      );
    }
  }]
  render() {
    const { visible } = this.props;
    return (
      <Modal
        title='请选择商品'
        visible={visible}
      >
        <ListPage
          namespace='productSelector'
          formConfig={defaultConfig}
          formItemLayout={(
            <>
              <FormItem name='productId' />
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
          api={() => Promise.resolve({ records: []})}
        />
      </Modal>
    );
  }
}

export default ProductSelector;