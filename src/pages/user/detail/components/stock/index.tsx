import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { getDefaultConfig } from './config'
import { getPurchaseList, eliminate } from './api'
import { parseQuery } from '@/util/utils'
import OffStockModal, { OffStockModalInstanceProps } from './components/OffStockModal'
interface State {
  visible: boolean,
  stock?: number
}
class Main extends React.Component<any, State> {
  public query: any = parseQuery()
  /** 核销采购ID */
  public purchaseId: number
  /** 核销库存 */
  public purchaseStock: number
  public state: State = {
    visible: false
  }
  public list: ListPageInstanceProps
  public OffStockModal: OffStockModalInstanceProps
  public columns = [
    {
      title: '采购批次',
      key: 'purchaseNo',
      dataIndex: 'purchaseNo',
      render: (id: any) => {
        return (
          <span
            className='href'
            onClick={() => APP.history.push(`/order/detail/${id}`)}
          >
            {id}
          </span>
        )
      }
    },
    {
      title: '采购时间',
      width: 200,
      key: 'createTime',
      dataIndex: 'createTime'
    },
    {
      title: '商品ID',
      width: 150,
      key: 'productId',
      dataIndex: 'productId',
      render: (id: number) => {
        return (
          <span
            className='href'
            onClick={() => APP.history.push(`/goods/edit/${id}`)}>
            {id}
          </span>
        )
      }
    },
    {
      title: '商品名称',
      width: 150,
      key: 'productName',
      dataIndex: 'productName'
    },
    {
      title: '采购成本(元)',
      width: 120,
      key: 'purchasePrice',
      dataIndex: 'purchasePrice'
    },
    {
      title: '采购量(件)',
      width: 120,
      key: 'purchaseCount',
      dataIndex: 'purchaseCount'
    },
    {
      title: '剩余库存(件)',
      width: 120,
      key: 'stock',
      dataIndex: 'stock'
    },
    {
      title: 'sku名称',
      width: 150,
      key: 'skuName',
      dataIndex: 'skuName'
    },
    {
      title: '团长价',
      width: 100,
      key: 'headPrice',
      dataIndex: 'headPrice'
    },
    {
      title: '区长价',
      width: 100,
      key: 'cityPrice',
      dataIndex: 'cityPrice'
    },
    {
      title: '合伙人价',
      width: 100,
      key: 'areaPrice',
      dataIndex: 'areaPrice'
    },
    {
      title: '管理员价',
      width: 100,
      key: 'managerPrice',
      dataIndex: 'managerPrice'
    },
    {
      title: '最后操作者',
      width: 150,
      key: 'lastModifyName',
      dataIndex: 'lastModifyName'
    },
    {
      title: '操作',
      key: 'operate',
      width: 80,
      fixed: 'right',
      render: (text: any, records: any) => {
        return (
          <span
            className='href'
            onClick={() => {
              this.purchaseId = records.id
              this.setState({
                visible: true,
                stock: records.stock
              })
            }}
          >
            核销
          </span>
        )
      }
    }
  ]
  public showModal = () => {
    this.setState({
      visible: true
    })
  }
  public handleOk = async (vals: any) => {
    const res = await eliminate({
      eliminateCount: vals.eliminateCount,
      purchaseId: this.purchaseId
    })
    if (res) {
      APP.success('核销库存成功')
      this.list.refresh()
      this.handleClose()
    }
  }
  public handleClose = () => {
    this.OffStockModal.resetFields()
    this.setState({
      visible: false,
      stock: undefined
    })
  }
  public render () {
    const { visible } = this.state
    return (
      <>
        <OffStockModal
          ref={(modal: any)=> this.OffStockModal = modal}
          title='核销库存'
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleClose}
          stockNum={this.state.stock}
        />
        <ListPage
          tableProps={{
            scroll: {
              x: true
            }
          }}
          getInstance={ref => this.list = ref}
          rangeMap={{
            pruchaseTime: {
              fields: ['pruchaseStartTime', 'purchaseEndTime']
            }
          }}
          formConfig={getDefaultConfig()}
          columns={this.columns}
          api={(payload: any) => getPurchaseList(Object.assign(payload, {
            memberId: this.query.memberId
          }))}
        />
      </>
    )
  }
}

export default Main