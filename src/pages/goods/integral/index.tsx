import React from 'react'
import ListPage, { ListPageInstanceProps } from '@/packages/common/components/list-page'
import { Button, Icon, InputNumber, Popconfirm } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import { GoodsProps } from './interface'
import { getFieldsConfig, StatusEnum } from './config'
import Image from '@/components/Image'
import * as api from './api'
import ShopModal from './components/shop-modal'
import styles from './style.module.styl'

interface State {
  editId?: any
  record?: GoodsProps
  selectedRowKeys: any[]
}

class Main extends React.Component<{}, State> {
  public shopModal: ShopModal
  public state: State = {
    selectedRowKeys: []
  }
  public columns: ColumnProps<GoodsProps>[] = [
    { title: '商品ID', dataIndex: 'id', width: 100 },
    {
      title: '主图',
      dataIndex: 'coverUrl',
      width: 150,
      render: (text) => {
        return (
          <Image src={text} />
        )
      }
    },
    { title: '商品名称', dataIndex: 'productName', width: 200 },
    { title: '上架状态', dataIndex: 'status', width: 100, align: 'center', render: (text) => StatusEnum[text] },
    { title: '供应商', dataIndex: 'storeName', width: 150 },
    { title: '销售价', dataIndex: 'salePrice', render: (text) => APP.fn.formatMoney(text) },
    {
      title: '积分可抵扣比例',
      dataIndex: 'exchangeRate',
      render: (text, record) => {
        const { editId } = this.state
        return editId === record.id ? (
          <InputNumber
            defaultValue={100}
            min={0}
            max={100}
            formatter={value => `${value}%`}
            value={this.state.record?.exchangeRate}
            parser={value => {
              return Number(value?.replace?.('%', '') || 0)
            }}
            onChange={(e) => {
              record.exchangeRate = e || 0
              this.setState({
                record
              })
            }}
          />
        ) : (
          <div>
            <span className='mr8'>
              {text}%
            </span>
            <Icon
              onClick={() => {
                this.setState({
                  editId: record.id,
                  record
                })
              }}
              type='form'
            />
          </div>
        )
      }
    },
    {
      title: '操作',
      width: 140,
      align: 'center',
      render: (text, record) => {
        const { editId } = this.state
        return (
          <div>
            {editId === record.id && (
              <>
                <span
                  className='href mr8'
                  onClick={() => {
                    this.updateExchange(record.id)
                  }}
                >
                  保存
                </span>
                <span
                  className='href mr8'
                  onClick={() => {
                    this.setState({
                      editId: undefined
                    })
                  }}
                >
                  取消
                </span>
              </>
            )}
            <Popconfirm
              title='确定是否删除该商品？'
              onConfirm={() => {
                this.toDelete([record.id])
              }}
            >
              <span
                className='danger'
              >
                删除
              </span>
            </Popconfirm>
          </div>
        )
      }
    }
  ]
  public listpage: ListPageInstanceProps
  public updateExchange (id: any) {
    const { record } = this.state
    if (!record) {
      return
    }
    api.updateExchange({
      id,
      exchangeRate: record.exchangeRate
    }).then(() => {
      this.setState({
        editId: undefined
      })
    })
  }
  public toDelete (ids: any[]) {
    api.toDelete(ids).then(() => {
      this.listpage.refresh()
    })
  }
  public onRowSelectionChange = (selectedRowKeys: any[]) => {
    console.log(selectedRowKeys, 'selectedRowKeys')
    this.setState({
      selectedRowKeys: selectedRowKeys
    })
  }
  public render () {
    const { selectedRowKeys } = this.state
    const rowSelection: TableRowSelection<CreditPay.ItemProps> = {
      selectedRowKeys,
      onChange: this.onRowSelectionChange
    }
    return (
      <div className={styles.page}>
        <ShopModal
          getInstance={(ref) => this.shopModal = ref}
          onOk={(rows, hide) => {
            const ids = rows.map((item) => item.id)
            api.addExchange(ids).then(() => {
              this.listpage.refresh()
              hide()
            })
          }}
        />
        <ListPage
          rowSelection={rowSelection}
          columns={this.columns}
          processPayload={(payload) => {
            return {
              ...payload,
              storeId: payload.store?.key,
              store: undefined
            }
          }}
          addonAfterSearch={(
            <div>
              <Button
                type='primary'
                onClick={() => {
                  this.shopModal.open()
                }}
              >
                新增商品
              </Button>
            </div>
          )}
          getInstance={(ref) => {
            this.listpage = ref
          }}
          api={api.fetchList}
          formConfig={getFieldsConfig()}
        />
        <Popconfirm
          title='确定是否批量删除？'
          onConfirm={() => {
            this.toDelete(selectedRowKeys)
          }}
        >
          <Button
            className={styles.delete}
            type='primary'
          >
            批量删除
          </Button>
        </Popconfirm>
      </div>
    )
  }
}
export default Main
