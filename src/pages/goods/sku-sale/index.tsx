import React from 'react';
import { Button, Modal, message, Divider } from 'antd';
import dateFns from 'date-fns';
import { getGoodsList, delGoodsDisable, enableGoods, exportFileList, getCategoryTopList } from '../api';
import { setQuery, parseQuery, gotoPage } from '@/util/utils';
import { formatMoneyWithSign } from '../../helper';
import Image from '@/components/Image';
import SelectFetch from '@/components/select-fetch';
import { If, ListPage, FormItem } from '@/packages/common/components';
import { ListPageInstanceProps } from '@/packages/common/components/list-page';
import SuppilerSelect from '@/components/suppiler-auto-select';
import { defaultConfig } from './config';

function replaceHttpUrl(imgUrl: string) {
  if (imgUrl.indexOf('http') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

interface SkuSaleListState {
  selectedRowKeys: string[] | number[]
}

class SkuSaleList extends React.Component<any, SkuSaleListState> {
  state: SkuSaleListState = {
    selectedRowKeys: []
  }
  list: ListPageInstanceProps;
  columns = [
    {
      title: '商品ID',
      dataIndex: 'id'
    },
    {
      title: '主图',
      dataIndex: 'coverUrl',
      width: 120,
      render: (record: any) => (
        <Image
          style={{
            height: 100,
            width: 100,
            minWidth: 100
          }}
          src={replaceHttpUrl(record)}
          alt='主图'
        />
      )
    },
    {
      title: '商品名称',
      dataIndex: 'productName'
    },
    {
      title: '类目',
      dataIndex: 'categoryName'
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      render: formatMoneyWithSign
    },
    {
      title: '销售价',
      dataIndex: 'salePrice',
      render: formatMoneyWithSign
    },
    {
      title: '库存',
      dataIndex: 'stock'
    },
    {
      title: '累计销量',
      width: 100,
      dataIndex: 'saleCount'
    },
    {
      title: '供应商',
      dataIndex: 'storeName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      render: (record: any) => <>{dateFns.format(record, 'YYYY-MM-DD HH:mm:ss')}</>
    },
    {
      title: '最后操作时间',
      dataIndex: 'modifyTime',
      width: 200,
      render: (record: any) => <>{dateFns.format(record, 'YYYY-MM-DD HH:mm:ss')}</>
    },
    {
      title: '操作',
      width: 160,
      align: 'center',
      render: (record: any) => (
        <>
          <span
            className='href'
            onClick={() => {
              gotoPage(`/goods/sku-sale/${record.id}`);
            }}
          >
            编辑
          </span>
          <If condition={status === '0'}>
            <Divider type='vertical' />
            <span
              className='href'
              onClick={() => this.delGoodsDisable([record.id])}
            >
              下架
            </span>
          </If>
          <If condition={status === '1'}>
            <Divider type='vertical' />
            <span
              className='href'
              onClick={() => this.enableGoods([record.id])}
            >
              上架
            </span>
          </If>
        </>
      )
    }
  ];

  /** 下架商品 */
  delGoodsDisable = (ids: string[] | number[]) => {
    Modal.confirm({
      title: '下架提示',
      content: '确认下架该商品吗?',
      onOk: () => {
        delGoodsDisable({ ids }).then(res => {
          if (res) {
            message.success('下架成功');
            this.list.refresh();
          }
        });
      }
    });
  }

  // 批量上架
  enableGoods = (ids: string[] | number[]) => {
    Modal.confirm({
      title: '上架提示',
      content: '确认上架该商品吗?',
      onOk: () => {
        enableGoods({ ids }).then(res => {
          if (res) {
            message.success('上架成功');
            this.list.refresh();
          }
        });
      }
    });
  };

  // 导出
  exportProduct = () => {
    exportFileList({
      ...this.list.payload,
      status: this.props.status,
      pageSize: 6000,
      page: 1
    });
  }

  /** 添加商品 */
  handleAdd = () => {
    APP.history.push('/goods/sku-sale/-1');
  }

  /**
   * 选择项发生变化时的回调
   */
  onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys
    });
  };
  // 新增组合商品
  addCommodity = () => {
    APP.history.push('/goods/sku-sale/-1')
  }
  render() {
    const { selectedRowKeys } = this.state;
    const hasSelected = Array.isArray(selectedRowKeys) && selectedRowKeys.length > 0
    const { status } = this.props;
    return (
      <>
        <ListPage
          namespace='skuSale'
          formConfig={defaultConfig}
          getInstance={ref => this.list = ref}
          rangeMap={{
            goodsTime: {
              fields: ['createStartTime', 'createEndTime']
            },
            optionTime: {
              fields: ['modifyStartTime', 'modifyEndTime']
            }
          }}
          formItemLayout={(
            <>
              <FormItem name='productName'/>
              <FormItem name='productId' />
              <FormItem
                label='供应商'
                inner={(form) => {
                  return form.getFieldDecorator('storeId')(
                    <SuppilerSelect />
                  );
                }}
              />
              <FormItem name='interceptor' />
              <FormItem name='goodsTime' />
              <FormItem name='optionTime' />
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
            </>
          )}
          addonAfterSearch={(
            <>
              <Button
                type='primary'
                className='mr10'
                onClick={this.exportProduct}
              >
                导出商品
              </Button>
              <Button
                className='mr10'
                type='primary'
                onClick={this.handleAdd}
              >
                添加商品
              </Button>
              <Button
                type='primary'
                onClick={this.addCommodity}
              >
                添加组合商品
              </Button>
            </>
          )}
          api={getGoodsList}
          columns={this.columns}
          tableProps={{
            rowSelection: {
              selectedRowKeys,
              onChange: this.onSelectChange
            },
            footer: () => (
              <>
                <If condition={status === '1'}>
                  <Button
                    type='danger'
                    onClick={() => {
                      this.enableGoods(selectedRowKeys)
                    }}
                    disabled={!hasSelected}
                  >
                    批量上架
                  </Button>
                </If>
                <If condition={status === '0'}>
                  <Button
                    type='danger'
                    onClick={() => {
                      this.delGoodsDisable(selectedRowKeys)
                    }}
                    disabled={!hasSelected}
                  >
                    批量下架
                  </Button>
                </If>
              </>
            )
          }}
        />
      </>
    );
  }
}

export default SkuSaleList;
