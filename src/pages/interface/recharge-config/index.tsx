import React from 'react'
import Page from '@/components/page'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, InputNumber } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { RecordProps } from './interface'
import { getFieldsConfig } from './config'
import Image from '@/components/Image'
import SelectModal from './components/SelectModal'
import * as api from './api'

interface State {
  dataSource: RecordProps[]
}

class Main extends React.Component<{}, State> {
  public columns: ColumnProps<RecordProps>[] = [
    { title: '商品ID', dataIndex: 'productId' },
    { title: 'SKUID', dataIndex: 'skuId' },
    { title: '商品名称', dataIndex: 'productName' },
    {
      title: '商品主图',
      dataIndex: 'coverUrl',
      render: (text) => {
        return (
          <Image src={text} />
        )
      }
    },
    { title: '规格', dataIndex: 'propertyValue' },
    { title: '成本价', dataIndex: 'costPrice', render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') },
    { title: '销售价', dataIndex: 'salePrice', render: (text) => APP.fn.formatMoneyNumber(text, 'm2u') },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 100,
      align: 'center',
      render: (text, record, index) => {
        return (
          <InputNumber
            value={text || 0}
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
    }
  ]
  public listpage: ListPageInstanceProps
  public selector: SelectModal
  public state: State = {
    dataSource: []
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData = () => {
    api.fetchGoodsList().then((res) => {
      res = (res || []).map((item: RecordProps) => {
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
    const payload = dataSource.map((item) => {
      return {
        productId: item.productId,
        skuId: item.skuId,
        sort: item.sort || 0
      }
    })
    api.saveGoodsConfig(payload).then(() => {
      this.fetchData()
    })
  }
  public refresh = () => {
    api.refreshGoods().then(() => {
      //
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
        <div className='mt16'>
          <Button
            onClick={this.save}
            className='mr8'
            type='primary'
          >
            保存并发布
          </Button>
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
