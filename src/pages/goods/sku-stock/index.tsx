import React from 'react';
import { ListPage, FormItem, If, SelectFetch } from '@/packages/common/components';
import SuppilerSelect from '@/components/suppiler-auto-select'
import { getPages, effectProduct, invalidProduct, exportProduct } from './api';
import { getCategoryTopList } from '../api';
import { defaultConfig, statusEnums } from './config';
import { Modal, Button, Popconfirm } from 'antd';
type Key = string | number;
interface SkuStockState {
  selectedRowKeys: Key[]
}
class SkuStockList extends React.Component<any, SkuStockState> {
  list: any;
  state = {
    selectedRowKeys: []
  }
  update(payload: any) {
    // 是否失效
    const isInvalid = payload.status === statusEnums['失效'];
    const params = { ids: [payload.id]};
    const promiseResult = isInvalid ? invalidProduct(params) : effectProduct(params);
    promiseResult.then(res => {
      if (res) {
        APP.success(`${isInvalid ? '失效': '生效'}成功`);
        this.list.refresh();
      }
    })
  }
  onSelectChange = (selectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  columns = [{
    title: '库存商品ID',
    width: 120,
    dataIndex: 'id'
  }, {
    title: '商品名称',
    width: 200,
    dataIndex: 'productName'
  }, {
    title: '商品编码',
    width: 150,
    dataIndex: 'productCode'
  }, {
    title: '商品条码',
    width: 120,
    dataIndex: 'barCode'
  }, {
    title: '类目',
    width: 120,
    dataIndex: 'categoryName'
  }, {
    title: '总库存',
    width: 120,
    dataIndex: 'stock'
  }, {
    title: '供应商',
    width: 150,
    dataIndex: 'storeName'
  }, {
    title: '状态',
    width: 100,
    dataIndex: 'statusText'
  }, {
    title: '创建时间',
    width: 200,
    dataIndex: 'createTimeText'
  }, {
    title: '最后操作时间',
    width: 200,
    dataIndex: 'modifyTimeText'
  }, {
    title: '操作人',
    width: 120,
    dataIndex: 'modifyUser'
  }, {
    title: '操作',
    width: 150,
    align: 'center',
    fixed: 'right',
    render: (records: any) => {
      return (
        <>
          <Button
            type='link'
            onClick={() => {
              APP.history.push(`/goods/sku-stock/${records.id}`)
            }}
          >
            编辑
          </Button>
          <If condition={records.status === statusEnums['正常']}>
            <Popconfirm
              title='确定失效吗'
              onConfirm={() => {
                this.update({
                  id: records.id,
                  status: statusEnums['失效']
                })
              }}>
                <span className='href'>失效</span>
            </Popconfirm>
          </If>
          <If condition={records.status === statusEnums['失效']}>
            <Popconfirm
              title='确定生效吗'
              onConfirm={() => {
                this.update({
                  id: records.id,
                  status: statusEnums['正常']
                })
              }}>
                <span className='href'>生效</span>
            </Popconfirm>
          </If>
        </>
      )
    }
  }]
  // 批量生效
  effect = () => {
    Modal.confirm({
      title: '是否批量生效勾选库存商品',
      onOk: () => {
        effectProduct({ ids: this.state.selectedRowKeys })
          .then(res => {
            if (res) {
              APP.success('批量生效成功');
              this.list.refresh();
            }
          })
      }
    })
  }
  // 批量失效
  invalid = () => {
    Modal.confirm({
      title: '是否批量失效勾选库存商品',
      onOk: () => {
        invalidProduct({ ids: this.state.selectedRowKeys })
          .then(res => {
            if (res) {
              APP.success('批量失效成功');
              this.list.refresh();
            }
          })
      }
    })
  }
  // 导出商品
  export = () => {
    exportProduct(this.list.payload).then(res => {
      if (res) {
        APP.success('导出库存商品成功');
      }
    })
  }
  handleAdd = () => {
    APP.history.push('/goods/sku-stock/-1');
  }
  render() {
    const { selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <ListPage
        namespace='skuStock'
        formItemLayout={(
          <>
            <FormItem name='productBasicId' />
            <FormItem name='productCode' />
            <FormItem name='productName' />
            <FormItem name='barCode' />
            <FormItem
              label='一级类目'
              inner={(form) => {
                return form.getFieldDecorator('categoryId')(
                  <SelectFetch
                    style={{ width: 172 }}
                    fetchData={getCategoryTopList}
                  />
                )
              }}
            />
            <FormItem name='status' />
            <FormItem
              label='供应商'
              inner={(form) => {
                return form.getFieldDecorator('storeId')(
                  <SuppilerSelect style={{ width: 172 }}/>
                )
              }}
            />
            <FormItem name='createTime' />
            <FormItem name='modifyTime' />
          </>
        )}
        rangeMap={{
          createTime: {
            fields: ['createStartTime', 'createEndTime']
          },
          modifyTime: {
            fields: ['modifyStartTime', 'modifyEndTime']
          }
        }}
        tableProps={{
          scroll: {
            x: true
          },
          rowSelection: {
            selectedRowKeys,
            onChange: this.onSelectChange
          }
        }}
        addonAfterSearch={(
          <div>
            <Button
              type='primary'
              onClick={this.handleAdd}
            >
              新增
            </Button>
            {/* <Button
              type='primary'
              className='ml10'
              onClick={this.export}
            >
              导出商品
            </Button> */}
            <Button
              type='primary'
              disabled={!hasSelected}
              className='ml10'
              onClick={this.invalid}
            >
              批量失效
            </Button>
            <Button
              type='primary'
              disabled={!hasSelected}
              className='ml10'
              onClick={this.effect}
            >
              批量生效
            </Button>
          </div>
        )}
        getInstance={ref => this.list = ref}
        formConfig={defaultConfig}
        api={getPages}
        columns={this.columns}
      />
    )
  }
}

export default SkuStockList;