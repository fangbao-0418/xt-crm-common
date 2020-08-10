import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { GoodsProps } from './interface'
import { getFieldsConfig } from './config'
import Image from '@/components/Image'

class Main extends React.Component {
  public columns: ColumnProps<GoodsProps>[] = [
    { title: '商品ID', dataIndex: 'id' },
    {
      title: '主图',
      dataIndex: 'coverUrl',
      render: (text) => {
        return (
          <Image src={text} />
        )
      }
    },
    { title: '商品名称', dataIndex: 'productName' },
    { title: '上架状态', dataIndex: 'status' },
    { title: '供应商', dataIndex: 'payType' },
    { title: '销售价', dataIndex: 'storeName' },
    { title: '积分可抵扣比例', dataIndex: 'exchangeRate' },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: () => {
        return (
          <div>
            <Button
              type='primary'
              size='small'
              className='mb8'
            >
              提现成功
            </Button>
            <Button
              size='small'
            >
              提现失败
            </Button>
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  public render () {
    return (
      <div>
        <ListPage
          columns={this.columns}
          showButton={false}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.listpage.refresh()
                }}
              >
                查询
              </Button>
              <Button
                className='mr8'
                onClick={() => {
                  this.listpage.refresh(true)
                }}
              >
                取消
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.listpage.refresh()
                }}
              >
                批量支付
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.listpage.refresh()
                }}
              >
                批量失败
              </Button>
              <Button
                type='primary'
                className='mr8'
                onClick={() => {
                  this.listpage.refresh()
                }}
              >
                批量导出
              </Button>
              <div className='fr'>
                <span
                  className='download mr8'
                  onClick={() => {
                    APP.fn.download(require('@/pages/fresh/assets/批量支付模版.xlsx'), '批量支付模版')
                  }}
                >
                  下载批量支付模版
                </span>
                <span
                  className='download'
                  onClick={() => {
                    APP.fn.download(require('@/pages/fresh/assets/批量失败模版.xlsx'), '批量失败模版')
                  }}
                >
                  下载批量失败模版
                </span>
              </div>
            </div>
          )}
          api={() => {
            return Promise.resolve({
              total: 0,
              records: [
                {
                  supplierCashOutId: '2222'
                }
              ]
            })
          }}
          formConfig={getFieldsConfig()}
        />
      </div>
    )
  }
}
export default Main
