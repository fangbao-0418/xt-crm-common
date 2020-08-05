import React from 'react'
import { Card, Tabs, Button, Modal, message, Icon } from 'antd'
import { If, ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { defaultConfig } from './config'
import SkuStockEditState from './components/sku-stock-edit'
import Image from '@/components/Image'
import { gotoPage, replaceHttpUrl } from '@/util/utils'
import dateFns from 'date-fns'
import SuppilerSelector from '@/components/supplier-selector'
import SelectFetch from '@/components/select-fetch'
import { ColumnProps } from 'antd/lib/table'
import { getGoodsList, delGoodsDisable, enableGoods, exportFileList, getCategoryTopList, copy } from '../api'
import { GoodProps } from './interface'

/** 此处类型后端传参0和1反了，0查找上架商品，上架商品实际状态为1 */
/** 0-出售中, 1-仓库中, 3-待上架 2-商品池 */
export type StatusType = '0' | '1' | '3' | '2';

interface Props {
  status: StatusType
}

interface SkuSaleListState {
  selectedRowKeys: string[] | number[];
  idOfStockEdit: number;
  visibleOfStockEdit: boolean;
  productNameOfStockEdit: string;
}

/** 是否是虚拟商品 true-是 false-否 */
function isVirtualGood (type: number) {
  return [50, 51].includes(type)
}

class Main extends React.Component<Props, SkuSaleListState> {
  state: SkuSaleListState = {
    selectedRowKeys: [],
    idOfStockEdit: 0,
    visibleOfStockEdit: false,
    productNameOfStockEdit: ''
  }
  list: ListPageInstanceProps;
  columns: ColumnProps<GoodProps>[] = [
    {
      title: '商品ID',
      width: 120,
      dataIndex: 'id'
    },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      width: 120,
      render: (record) => (
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
      width: 120,
      dataIndex: 'productName'
    },
    {
      title: '类目',
      width: 120,
      dataIndex: 'categoryName'
    },
    {
      title: '成本价',
      width: 100,
      dataIndex: 'costPrice',
      render: APP.fn.formatMoney
    },
    {
      title: '销售价',
      width: 100,
      dataIndex: 'salePrice',
      render: APP.fn.formatMoney
    },
    {
      title: '总库存',
      width: 100,
      dataIndex: 'stock',
      align: 'center',
      render: (text: any, record, index:any) => {
        if (isVirtualGood(record.type)) {
          return '无'
        }
        return (
          <div style={{ whiteSpace: 'nowrap' }}>
            <span>{text}</span>
            <Icon type='form' style={{ fontSize: '20px', marginLeft: '5px' }} onClick={() => {
              this.setState({
                idOfStockEdit: record.id,
                visibleOfStockEdit: true,
                productNameOfStockEdit: record.productName
              })
            }} />
          </div>
        )
      }
    },
    {
      title: '可用库存',
      width: 100,
      dataIndex: 'usableStock',
      align: 'center',
      render: (text, record) => {
        return isVirtualGood(record.type) ? '无' : text
      }
    },
    {
      title: '累计销量',
      width: 100,
      align: 'center',
      dataIndex: 'saleCount'
    },
    {
      title: '供应商',
      width: 120,
      dataIndex: 'storeName'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
      render: (record) => <>{dateFns.format(record, 'YYYY-MM-DD HH:mm:ss')}</>
    },
    {
      title: '最后操作时间',
      dataIndex: 'modifyTime',
      width: 200,
      render: (record) => <>{dateFns.format(record, 'YYYY-MM-DD HH:mm:ss')}</>
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 120,
      render: (text, record) => {
        const { status } = this.props
        return (
          <div>
            <If condition={status !== '2'}>
              <div
                className='href'
                onClick={() => this.copy(record.id)}
              >
                复制
              </div>
            </If>
            <div
              className='href'
              onClick={() => {
                const url = isVirtualGood(record.type) ?`/goods/virtual/${record.id}` : `/goods/sku-sale/${record.id}`
                APP.history.push(url)
              }}
            >
              编辑
            </div>
            <If condition={status === '0'}>
              <div
                className='href'
                onClick={() => this.lower([record.id])}
              >
                下架
              </div>
            </If>
            <If condition={status === '1'}>
              <div
                className='href'
                onClick={() => this.upper([record.id])}
              >
                上架
              </div>
            </If>
          </div>
        )
      }
    }
  ];

  /** 下架商品 */
  lower = (ids: string[] | number[]) => {
    Modal.confirm({
      title: '下架提示',
      content: '确认下架该商品吗?',
      onOk: () => {
        delGoodsDisable({ ids }).then((res: any) => {
          if (res) {
            message.success('下架成功')
            this.list.refresh()
          }
        })
      }
    })
  }
 /** 复制商品 */
 copy = (productId: any) => {
   Modal.confirm({
     title: '复制提示',
     content: '确认复制该商品吗?',
     onOk: () => {
       copy({ productId }).then((res: any) => {
         if (res) {
           message.success('商品已复制到待上架列表中')
           this.list.refresh()
         }
       })
     }
   })
 }
  // 批量上架
  upper = (ids: string[] | number[]) => {
    Modal.confirm({
      title: '上架提示',
      content: '确认上架该商品吗?',
      onOk: () => {
        enableGoods({ ids }).then((res: any) => {
          if (res) {
            message.success('上架成功')
            this.list.refresh()
          }
        })
      }
    })
  };

  // 导出
  export = () => {
    exportFileList({
      ...this.list.getPayload(),
      status: this.props.status,
      pageSize: 6000,
      page: 1
    })
  }

  /**
   * 选择项发生变化时的回调
   */
  onSelectChange = (selectedRowKeys: any) => {
    this.setState({
      selectedRowKeys
    })
  }

  // 库存编辑 关闭
  handleSkuStockEditCancel = (status:boolean) => {
    this.setState({ visibleOfStockEdit: false })
    if (status) {
      this.list.refresh()
    }
  }
  public render () {
    const { selectedRowKeys, visibleOfStockEdit, idOfStockEdit, productNameOfStockEdit } = this.state
    const hasSelected = Array.isArray(selectedRowKeys) && selectedRowKeys.length > 0
    const { status } = this.props
    const tableProps: any = {
      scroll: {
        x: true
      },
      rowSelection: {
        selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
    if (['1', '0'].includes(status)) {
      tableProps.footer = () => (
        <>
          <If condition={status === '1'}>
            <Button
              type='danger'
              onClick={() => {
                this.upper(selectedRowKeys)
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
                this.lower(selectedRowKeys)
              }}
              disabled={!hasSelected}
            >
              批量下架
            </Button>
          </If>
        </>
      )
    }
    const reserveKey = 'goods/list-' + status
    return (
      <div>
        <ListPage
          reserveKey={reserveKey}
          namespace='skuSale'
          className='vertical-align-table'
          style={{
            padding: '0px 16px 0'
          }}
          formConfig={defaultConfig}
          getInstance={ref => this.list = ref}
          cachePayloadProcess={(payload) => {
            return {
              ...payload
            }
          }}
          processPayload={(payload) => {
            return {
              ...payload,
              status: +status,
              storeId: payload.store?.key,
              store: undefined
            }
          }}
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
              <FormItem name='productName' />
              <FormItem name='productId' />
              <FormItem
                label='供应商'
                inner={(form) => {
                  return form.getFieldDecorator('store')(
                    <SuppilerSelector type='yx' style={{ width: 172 }} />
                  )
                }}
              />
              <FormItem name='interceptor' />
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
              <FormItem name='goodsTime' />
              <FormItem name='optionTime' />
            </>
          )}
          addonAfterSearch={(
            <>
              {/* <Button
                type='primary'
                className='mr8'
                onClick={this.export}
              >
                导出商品
              </Button> */}
              <Button
                className='mr8'
                type='primary'
                onClick={() => {
                  APP.history.push('/goods/sku-sale/-1?isGroup=0')
                }}
              >
                添加商品
              </Button>
              <Button
                className='mr8'
                type='primary'
                onClick={() => {
                  APP.history.push('/goods/virtual/-1')
                }}
              >
                新增虚拟商品
              </Button>
              {/* <Button
                type='primary'
                onClick={() => {
                  APP.history.push('/goods/sku-sale/-1?isGroup=1')
                }}
              >
                添加组合商品
              </Button> */}
            </>
          )}
          autoFetch={false}
          api={getGoodsList}
          columns={this.columns}
          tableProps={tableProps}
        />
        <SkuStockEditState
          id={idOfStockEdit}
          visible={visibleOfStockEdit}
          name={productNameOfStockEdit}
          onCancel={() => this.handleSkuStockEditCancel(false)}
          onOK={() => {
            this.handleSkuStockEditCancel(true)
          }}
        />
      </div>
    )
  }
}
export default Main
