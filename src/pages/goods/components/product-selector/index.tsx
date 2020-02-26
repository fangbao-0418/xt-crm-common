import React from 'react';
import { Form, FormItem, SelectFetch } from '@/packages/common/components';
import { FormInstance } from '@/packages/common/components/form';
import { defaultConfig } from './config';
import { Modal, Table } from 'antd';
import { unionBy, omit, union } from 'lodash';
import { getCategoryTopList } from '../../api';
import { CSkuProps } from '../../sku-stock/components/sku';
import { getBaseProductPage } from '../../sku-sale/api';
import { ColumnProps } from 'antd/lib/table';
interface ProductSelectorProps {
  onOk: (selectedRowKeys: any, selectedRows: any[], selectedRowKeysMap: any) => void;
  selectedRowKeys: any[],
  selectedRowKeysMap: any;
}

// 组合
function combination(selectedRows: any[], selectedRowKeysMap: any) {
  let result: any[] = [];
  for (let row of selectedRows) {
    const productBasicSkuInfos = row.productBasicSkuInfos.filter((v: any) => {
      return (selectedRowKeysMap[row.id] || []).includes(v.productBasicSkuId);
    })
    for (let item of productBasicSkuInfos) {
      result.push({ ...row, ...item})
    }
  }
  return result;
}

function getSelectedRowKeysMap(selectedRows: any[]) {
  const result: any = {};
  for (let item of selectedRows) {
    const productBasicSkuInfos: any[] = item.productBasicSkuInfos || [];
    const childKeys: any[] = productBasicSkuInfos.map(v => v.productBasicSkuId);
    if (item.id) {
      result[item.id] = childKeys;
    }
  }
  return result;
}

interface ProductSelectorState {
  selectedRowKeys: string[] | number[];
  selectedRowKeysMap: Partial<{ [field: string] : string[] | number[] }>;
  visible: boolean;
  dataSource: any[];
  total: number;
  page: number;
  pageSize: number;
}
class ProductSelector extends React.Component<ProductSelectorProps, ProductSelectorState> {
  state: ProductSelectorState = {
    selectedRowKeys: [],
    selectedRowKeysMap: {},
    visible: false,
    dataSource: [],
    total: 0,
    page: 1,
    pageSize: 10
  }
  payload = {
    page: 1,
    pageSize: 10
  }
  form: FormInstance;
  selectedRows: any[] = [];
  columns: ColumnProps<any>[] = [{
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
    render: (data: CSkuProps[], record: any, index: number) => {
      const { selectedRowKeysMap } = this.state;
      const id = record.id;
      let productBasicSkuInfoKeys: any[] = selectedRowKeysMap[id] || [];
      return (
        <Table
          rowKey='productBasicSkuId'
          rowSelection={{
            selectedRowKeys: productBasicSkuInfoKeys,
            onChange: (productBasicSkuInfoKeys: any[], productBasicSkuInfoRows: any[]) => {
              const productBasicSkuInfos: any[]= record.productBasicSkuInfos;
              let selectedRowKeys: any[] = this.state.selectedRowKeys || [];

              const { selectedRowKeysMap } = this.state;
              selectedRowKeysMap[id] = productBasicSkuInfoKeys;
              
              if (!!(productBasicSkuInfos && productBasicSkuInfos.length) &&
                productBasicSkuInfoKeys.length === 0) {
                selectedRowKeys = selectedRowKeys.filter(key => key !== id); 
                this.selectedRows = this.selectedRows.filter(v => v.id !== id);
              } else {
                selectedRowKeys = union(selectedRowKeys, [id]);
                this.selectedRows = unionBy(this.selectedRows, [{
                  ...record,
                  productBasicSkuInfos: productBasicSkuInfoRows
                }], x => x.id);
              }

              console.log('this.selectedRows =>', this.selectedRows);
              this.setState({
                selectedRowKeys,
                selectedRowKeysMap
              })
            }
          }}
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
  UNSAFE_componentWillReceiveProps({ selectedRowKeys, selectedRowKeysMap }: ProductSelectorProps) {
    this.setState({
      selectedRowKeys,
      selectedRowKeysMap
    })
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData() {
    this.setState({
      page: this.payload.page,
      pageSize: this.payload.pageSize
    })
    getBaseProductPage(this.payload)
      .then((res: any) => {
        this.setState({
          dataSource: res.records || [],
          total: res.total || 0
        })
      })
  }

  handleOK = () => {
    const { selectedRowKeys, selectedRowKeysMap } = this.state;
    const productBasics = combination(this.selectedRows, selectedRowKeysMap);
    if (productBasics.length === 0) {
      return void APP.error('请选择商品');
    }
    this.props.onOk(selectedRowKeys, productBasics, selectedRowKeysMap);
    this.setState({ visible: false})
  }
  handleCancel = () => {
    this.setState({
      visible: false
    })
  }
  handleSubmit = (value: any) => {
    this.payload = {
      ...this.payload,
      ...value
    };
    this.fetchData();
  }
  render() {
    const {
      selectedRowKeys,
      visible,
      dataSource,
      total,
      pageSize,
      page
    } = this.state;
    return (
      <>
        <Modal
          title='请选择商品'
          visible={visible}
          onCancel={this.handleCancel}
          onOk={this.handleOK}
          width='70%'
        >
          <Form
            layout='inline'
            showButton
            getInstance={ref => this.form = ref}
            namespace='productSelector'
            config={defaultConfig}
            onSubmit={this.handleSubmit}
          >
            <FormItem name='productBasicId' />
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
          </Form>
          <Table
            rowKey='id'
            className='mt10'
            columns={this.columns}
            dataSource={dataSource}
            pagination={{
              onChange: (current) => {
                this.payload.page = current
                this.fetchData()
              },
              showTotal: (t) => {
                return `共计${t}条`
              },
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: (current, size) => {
                this.payload.pageSize = size
                this.payload.page = current
                this.fetchData()
              },
              total,
              pageSize,
              current: page
            }}
            rowSelection={{
              selectedRowKeys,
              getCheckboxProps: (record) => {
                const { selectedRowKeysMap } = this.state;
                const productBasicSkuInfosRowKeys = selectedRowKeysMap[record.id];
                const productBasicSkuInfos = record.productBasicSkuInfos || [];
                return {
                  indeterminate: !!(productBasicSkuInfosRowKeys && productBasicSkuInfosRowKeys.length) &&
                    productBasicSkuInfosRowKeys.length < productBasicSkuInfos.length
                }
              },
              onChange: (selectedRowKeys: string[] | number[], selectedRows: any[]) => {
                // fix ant-design bug
                const unionArray: any[] = unionBy(this.selectedRows, selectedRows, x => x.id)


                this.selectedRows = unionArray.filter(x => selectedRowKeys.includes(x.id as never));
                this.setState({
                  selectedRowKeysMap: getSelectedRowKeysMap(this.selectedRows),
                  selectedRowKeys
                })
              }
            }}
          />
        </Modal>
        <span
          className='href'
          onClick={() => {
            this.setState({ visible: true })
          }}
        >
          新增商品
        </span>
      </>
    );
  }
}

export default ProductSelector;