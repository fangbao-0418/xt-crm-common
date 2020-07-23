import React from 'react'
import { Card, Tabs, Button, Modal, message, Row } from 'antd'
import dateFns from 'date-fns'
import { ColumnProps } from 'antd/lib/table'
import {
  getGoodsList,
  delGoodsDisable,
  enableGoods,
  exportFileList,
  getCategoryTopList,
  upByGoodsId,
  cancelUpByGoodsId,
  copy
} from '../api'
import { gotoPage, replaceHttpUrl } from '@/util/utils'
import Image from '@/components/Image'
import SelectFetch from '@/components/select-fetch'
import { If, ListPage, FormItem } from '@/packages/common/components'
import { ListPageInstanceProps } from '@/packages/common/components/list-page'
import SuppilerSelect from '@/components/suppiler-auto-select'
import { defaultConfig } from './config'
import { GoodsSpuItem } from './interface'
import SuppilerSelector from '@/components/supplier-selector'

interface SkuSaleListState {
  selectedRowKeys: string[] | number[]
}

/** 0-出售中, 1-仓库中 */
export type StatusType = '0' | '1'

interface Props {
  status: StatusType
}

class SkuSaleList extends React.Component<Props, SkuSaleListState> {
  state: SkuSaleListState = {
    selectedRowKeys: []
  };
  list: ListPageInstanceProps;
  columns: ColumnProps<GoodsSpuItem>[] = [
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
      dataIndex: 'firstCategoryName'
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
      title: '库存',
      width: 100,
      dataIndex: 'stock'
    },
    {
      title: '累计销量',
      width: 100,
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
      render: (record) => (
        <>{dateFns.format(record, 'YYYY-MM-DD HH:mm:ss')}</>
      )
    },
    {
      title: '最后操作时间',
      dataIndex: 'modifyTime',
      width: 200,
      render: (record) => (
        <>{dateFns.format(record, 'YYYY-MM-DD HH:mm:ss')}</>
      )
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      width: 180,
      render: (text, record) => {
        const { status } = this.props
        return (
          <div>
            <If condition={status === '0' && record.top === 0}>
              <span className='href' onClick={this.up.bind(this, record.id)}>
                置顶
              </span>
            </If>
            <If condition={status === '0' && record.top === 1}>
              <span
                className='href'
                onClick={this.cancelUp.bind(this, record.id)}
              >
                取消置顶
              </span>
            </If>
            <span
              className='href ml8'
              onClick={() => {
                gotoPage(`/fresh/goods/sku-sale/${record.id}`)
              }}
            >
              编辑
            </span>
            <span
              className='href ml8'
              onClick={() => {
                this.copy(record.id)
              }}
            >
              复制
            </span>
            <If condition={status === '0'}>
              <span
                className='href ml8'
                onClick={() => this.lower([record.id])}
              >
                下架
              </span>
            </If>
            <If condition={status === '1'}>
              <span
                className='href ml8'
                onClick={() => this.upper([record.id])}
              >
                上架
              </span>
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
  };

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
      ...this.list.payload,
      status: +this.props.status
      // pageSize: 6000,
      // page: 1
    })
  };

  /**
   * 选择项发生变化时的回调
   */
  onSelectChange = (selectedRowKeys: any) => {
    this.setState({
      selectedRowKeys
    })
  };

  // 置顶事件
  up = (id: string) => {
    upByGoodsId({ productId: id }).then((res) => {
      if (res) {
        message.success('置顶成功')
        this.list.refresh()
      }
    })
  };

  // 取消置顶事件
  cancelUp = (id: string) => {
    cancelUpByGoodsId({ productId: id }).then((res) => {
      if (res) {
        message.success('取消置顶成功')
        this.list.refresh()
      }
    })
  };

  /** 复制商品 */
  copy = (productId: any) => {
    Modal.confirm({
      title: '复制提示',
      content: '确认复制该商品吗?',
      onOk: () => {
        copy(productId).then((res: any) => {
          if (res) {
            message.success('商品已复制到仓库列表中')
            this.list.refresh()
          }
        })
      }
    })
  }

  render () {
    const { selectedRowKeys } = this.state
    const hasSelected = Array.isArray(selectedRowKeys) && selectedRowKeys.length > 0
    const { status } = this.props
    const tableProps: any = {
      rowKey: 'id',
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
    const reserveKey = 'fresh/goods/list-' + status
    return (
      <ListPage
        reserveKey={reserveKey}
        namespace='freshSku'
        className='vertical-align-table'
        style={{
          margin: '0 8px'
        }}
        formConfig={defaultConfig}
        getInstance={(ref) => (this.list = ref)}
        processPayload={(payload) => {
          return {
            ...payload,
            status: +status,
            storeId: payload.store?.key,
            store: undefined
          }
        }}
        cachePayloadProcess={(payload) => {
          return payload
        }}
        rangeMap={{
          goodsTime: {
            fields: ['createStartTime', 'createEndTime']
          },
          optionTime: {
            fields: ['modifyStartTime', 'modifyEndTime']
          }
        }}
        formItemLayout={
          <>
            <Row>
              <FormItem name='productName' />
              <FormItem name='productId' />
              <FormItem
                label='供应商'
                inner={(form) => {
                  return form.getFieldDecorator('store')(
                    <SuppilerSelector type='all' category={5} style={{ width: '174px' }} />
                  )
                }}
              />
            </Row>
            <Row>
              <FormItem
                label='一级类目'
                inner={(form) => {
                  return form.getFieldDecorator('firstCategoryId')(
                    <SelectFetch
                      style={{ width: 172 }}
                      fetchData={getCategoryTopList}
                    />
                  )
                }}
              />
              <FormItem name='goodsTime' />
            </Row>
            <FormItem name='optionTime' />
          </>
        }
        addonAfterSearch={
          <>
            <Button type='primary' className='mr10' onClick={this.export}>
              导出商品
            </Button>
            <Button
              className='mr10'
              type='primary'
              onClick={() => {
                APP.history.push('/fresh/goods/sku-sale/-1')
              }}
            >
              添加商品
            </Button>
          </>
        }
        api={getGoodsList}
        columns={this.columns}
        tableProps={tableProps}
      />
    )
  }
}

export default SkuSaleList
