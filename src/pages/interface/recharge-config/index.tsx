/* eslint-disable no-cond-assign */
import React from 'react'
import Page from '@/components/page'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, InputNumber, Popconfirm } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import Image from '@/components/Image'
import SelectModal from './components/SelectModal'
import ConfigureCouponsModal from './components/ConfigureCouponsModal'
import * as api from './api'
import { StatusEnum } from './config'
import { verifyConfigData } from './verify'
interface State {
  dataSource: RecordProps[]
}

class Main extends React.Component<{}, State> {
  public skuId: any
  public columns: ColumnProps<RecordProps>[] = [
    { title: '商品ID', dataIndex: 'productId' },
    { title: 'SKUID', dataIndex: 'skuId' },
    { title: '商品名称', dataIndex: 'productName' },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      width: 150,
      render: (text) => {
        return (
          <Image src={text} />
        )
      }
    },
    { title: '规格', dataIndex: 'propertyValue' },
    { title: '成本价', dataIndex: 'costPrice', render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') },
    { title: '市场价', dataIndex: 'marketPrice', render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') },
    { title: '销售价', dataIndex: 'salePrice', render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (text) => {
        return StatusEnum[text]
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      align: 'center',
      render: (text, record, index) => {
        return (
          <InputNumber
            value={text || 0}
            min={0}
            max={9999}
            onChange={(value) => {
              const dataSource = this.state.dataSource
              dataSource[index].sort = value as number
              this.setState({
                dataSource
              })
            }}
          />
        )
      }
    },
    {
      title: '操作',
      width: 110,
      align: 'center',
      render: (text, record, index) => {
        return (
          <div>
            <div
              className='href'
              onClick={() => {
                const dataSource = this.state.dataSource
                dataSource.splice(index, 1)
                this.setState({
                  dataSource
                })
              }}
            >
              删除
            </div>
            <div
              className='href'
              onClick={() => {
                this.skuId=record.skuId
                this.selectorConfigure.open((record.couponCodes)&&(record.couponCodes).toString())
              }}
            >
              配置优惠券
            </div>
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  public selector: SelectModal
  public selectorConfigure: ConfigureCouponsModal
  public state: State = {
    dataSource: []
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData = () => {
    api.fetchGoodsList().then((res) => {
      res = (res || []).map((item) => {
        return {
          ...item,
          coverUrl: item.coverImage,
          propertyValue: item.property
        }
      })
      this.setState({
        dataSource: res
      })
    })
  }
  public save = () => {
    const { dataSource } = this.state
    if (!verifyConfigData(dataSource)) {
      return
    }
    const payload = dataSource.map((item) => {
      return {
        productId: item.productId,
        skuId: item.skuId,
        sort: item.sort || 0,
        couponCodes: item.couponCodes
      }
    })
    api.saveGoodsConfig(payload).then(() => {
      APP.success('操作成功')
      this.fetchData()
    })
  }
  public refresh = () => {
    api.refreshGoods().then(() => {
      APP.success('操作成功')
    })
  }
  public render () {
    const { dataSource } = this.state
    return (
      <Page>
        <SelectModal
          onOk={(rows) => {
            let res: RecordProps[] = []
            rows.map((item) => {
              item.skuList = (item.skuList || []).map((item2) => {
                return {
                  ...item2,
                  status: item2.status ?? item.status
                }
              })
              res = res.concat(item.skuList as any[])
            })
            this.setState({
              dataSource: res
            })
            this.selector.hide()
          }}
          getInstance={(ref) => {
            this.selector = ref
          }}
        />
        <ConfigureCouponsModal
          onOk={(res: any) => {
            dataSource.map((data:any, key: any)=>{
              if (this.skuId===data.skuId) {
                dataSource[key].couponCodes=res
              }
            })
            this.setState({
              dataSource
            })
            this.selectorConfigure.hide()
          }}
          getInstance={(ref) => {
            this.selectorConfigure = ref
          }}
        />
        <div className='mb8'>
          <Button
            type='danger'
            onClick={() => {
              this.selector.open(this.state.dataSource)
            }}
          >
            请选择商品
          </Button>
        </div>
        <ListPage
          style={{ margin: '0' }}
          columns={this.columns}
          showButton={false}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          tableProps={{
            rowKey: 'skuId',
            pagination: false,
            dataSource
          }}
        />
        <div className='mt20'>
          <Popconfirm
            title='确认是否保存并发布'
            onConfirm={this.save}
          >
            <Button
              className='mr8'
              type='primary'
            >
              保存并发布
            </Button>
          </Popconfirm>
          <Button
            type='primary'
            onClick={this.refresh}
          >
            刷新话费信息
          </Button>
        </div>
      </Page>
    )
  }
}
export default Main
