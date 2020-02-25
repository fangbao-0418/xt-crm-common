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
  onOk: (selectedRows: any[], hide: () => void) => void;
  selectedRows: any[];
}

// 组合
function combination(dataSource: any[]) {
  const result = dataSource.reduce((prev, curr) => {
    curr = curr.productBasicSkuInfos
      .map((x: any) => ({ ...x, ...curr}))
      .filter((v: any) => {
        return (curr.productBasicSkuInfosRowKeys || []).includes(v.productBasicSkuId)
      });
    return prev.concat(curr)
  }, []);
  return result;
}


// 展开
function expansion(data: any[], selectedRows: any[]) {
  return data.map(item => {
    item.productBasicSkuInfosRowKeys =
      item.productBasicSkuInfos
      .map((v: any) => v.productBasicSkuId)
      .filter((id: any) => selectedRows.find(item => item.productBasicSkuId === id))
    return item;
  })
}

interface ProductSelectorState {
  selectedRowKeys: any[];
  visible: boolean;
  dataSource: any[];
  total: number;
  page: number;
  pageSize: number;
}
class ProductSelector extends React.Component<ProductSelectorProps, ProductSelectorState> {
  state: ProductSelectorState = {
    selectedRowKeys: [],
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
  seletedRows: any[] = [];
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
    render: (data: CSkuProps[], records: any, index: number) => {
      return (
        <Table
          rowKey='productBasicSkuId'
          rowSelection={{
            selectedRowKeys: records.productBasicSkuInfosRowKeys || [],
            onChange: (productBasicSkuInfosRowKeys: any[]) => {
              let { dataSource, selectedRowKeys } = this.state;
              const productBasicSkuInfos = records.productBasicSkuInfos || [];
              dataSource[index].productBasicSkuInfosRowKeys = productBasicSkuInfosRowKeys;
              if (!!productBasicSkuInfosRowKeys.length && productBasicSkuInfosRowKeys.length < productBasicSkuInfos.length) {
                // 必须保证id唯一否则有bug
                selectedRowKeys = selectedRowKeys.filter(id => id !== records.id);
              } else {
                selectedRowKeys = union(selectedRowKeys, [records.id])
              }
              this.setState({ dataSource, selectedRowKeys })
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
  UNSAFE_componentWillReceiveProps({ selectedRows }: ProductSelectorProps) {
    const selectedRowKeys = selectedRows.map(v => v.id);
    this.setState({
      selectedRowKeys,
      dataSource: expansion(this.state.dataSource, selectedRows)
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
  // TODO
  handleOK = () => {
    const { dataSource } = this.state;
    const result = combination(dataSource);
    if (result.length === 0) {
      return void APP.error('请选择商品');
    }
    this.props.onOk(result, () => {
      this.setState({ visible: false})
    });
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
                const productBasicSkuInfosRowKeys = record.productBasicSkuInfosRowKeys || [];
                const productBasicSkuInfos = record.productBasicSkuInfos || [];
                return {
                  indeterminate: !!productBasicSkuInfosRowKeys.length && productBasicSkuInfosRowKeys.length < productBasicSkuInfos.length
                }
              },
              onChange: (selectedRowKeys: string[] | number[], selectedRows: any[]) => {
                let { dataSource } = this.state;
                // fix ant-design bug
                const unionArray: any[] = unionBy(this.seletedRows, selectedRows, x => x.id)
                this.seletedRows = unionArray.filter(x => selectedRowKeys.includes(x.id as never));
                dataSource = dataSource.map(item => {
                  if (selectedRowKeys.includes(item.id as never)) {
                    item.productBasicSkuInfosRowKeys = item.productBasicSkuInfos.map((v: any) => v.productBasicSkuId);
                    return item;
                  } else {
                    return omit(item, 'productBasicSkuInfosRowKeys');
                  }
                })
                this.setState({
                  selectedRowKeys,
                  dataSource
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