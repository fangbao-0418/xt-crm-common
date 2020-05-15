import React from 'react'
import { Modal, Table, Button } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import * as api from '../api'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import SkuTable from './SkuTable'
import SelectFetch from '@/components/select-fetch'
import styles from './style.module.sass'

/** 商品状态枚举 */
enum GoodStatusEnum {
  出售中 = 0,
  仓库中 = 1,
  待上架 = 3,
  商品池 = 2
}

interface State {
  visible: boolean
  dataSource: Shop.ShopItemProps[]
  selectedRowKeys: number[]
  total: number
  page: number
  pageSize: number
  /** spu下所选的skuId集合 */
  spuSelectedRowKeys: {[spuId: number]: number[]}
  type: 'sku' | 'spu'
}
interface Props {
  getInstance?: (ref: Main) => void
  onOk?: (rows: Shop.ShopItemProps[]) => void
}
export type ShopModalInstance = Main
interface PayloadProps {
  productId?: any
  productName?: string
  status?: number
  categoryIds?: string
  page: number
  pageSize: number
}
class Main extends React.Component<Props, State> {
  public payload: PayloadProps = {
    page: 1,
    pageSize: 10
  }
  public selectRows: Shop.ShopItemProps[] = []
  public form: FormInstance
  public columns: ColumnProps<Shop.ShopItemProps>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      width: 150
    },
    {
      title: '商品',
      // width: 240,
      dataIndex: 'productName',
      render: (text, record) => {
        return (
          <div className={styles.shop}>
            {/* <div className={styles['shop-img']}>
              <Image
                src={record.coverUrl}
                width={80}
                height={80}
              />
            </div> */}
            <div className={styles['shop-right']} >
              <div>{record.productName}</div>
            </div>
          </div>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (text) => {
        return GoodStatusEnum[text]
      }
    },
    {
      title: '类目',
      width: 120,
      dataIndex: 'categoryName',
      align: 'center'
    },
    {
      title: '价格',
      width: 0,
      render: (text, record) => {
        const skuSelectedRowKeys = this.state.spuSelectedRowKeys[record.id] || []
        return (
          <SkuTable
            key={record.id}
            dataSource={record.skuList}
            allSelected={this.state.selectedRowKeys.indexOf(record.id) > -1}
            selectedRowKeys={skuSelectedRowKeys}
            onSelect={(rowKeys, rows = []) => {
              let { selectedRowKeys } = this.state
              const index = this.selectRows.findIndex((item) => item.id === record.id)
              const isExist = index > -1
              const spuSelectedRowKeys = this.state.spuSelectedRowKeys
              spuSelectedRowKeys[record.id] = rowKeys
              if (rowKeys.length > 0) {
                if (!isExist) {
                  selectedRowKeys = selectedRowKeys.concat([record.id])
                  this.selectRows = this.selectRows.concat([{
                    ...record,
                    skuList: rows
                  }])
                } else {
                  this.selectRows[index].skuList = rows
                }
              } else if (rowKeys.length === 0 && isExist) {
                selectedRowKeys = selectedRowKeys.filter((id) => id !== record.id)
                this.selectRows = this.selectRows.filter((item) => item.id !== record.id)
                delete this.state.spuSelectedRowKeys[record.id]
              }
              this.setState({
                selectedRowKeys: selectedRowKeys,
                spuSelectedRowKeys: this.state.spuSelectedRowKeys
              })
            }}
          />
        )
      }
    }
  ]
  public state: State = {
    visible: false,
    dataSource: [],
    selectedRowKeys: [],
    page: this.payload.page,
    pageSize: this.payload.pageSize,
    spuSelectedRowKeys: [],
    total: 0,
    type: 'sku'
  }
  public constructor (props: Props) {
    super(props)
    this.onRowSelectionChange = this.onRowSelectionChange.bind(this)
    this.onRowSelectionSelect = this.onRowSelectionSelect.bind(this)
    this.onRowSelectionSelectAll = this.onRowSelectionSelectAll.bind(this)
    this.onOk = this.onOk.bind(this)
  }
  public componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
    }
  }
  public fetchData () {
    this.setState({
      page: this.payload.page
    })
    api.fetchSelectShopList(this.payload).then((res: any) => {
      this.setState({
        dataSource: res.records || [],
        total: res.total
      })
    })
  }
  public onOk () {
    if (this.props.onOk) {
      this.props.onOk([
        ...this.selectRows
      ])
    }
  }
  public open (skuList: any[] = [], type: 'sku' | 'spu' = 'sku') {

    this.payload = {
      page: 1,
      pageSize: 10
    }
    if (this.form) {
      this.form.props.form.resetFields()
    }
    this.fetchData()

    const allSkuSelectedRows: {[spuId: number]: Shop.SkuProps[]} = {}
    this.selectRows = [];
    (skuList || []).map((item) => {
      if (!(allSkuSelectedRows[item.productId] instanceof Array)) {
        allSkuSelectedRows[item.productId] = []
      }
      allSkuSelectedRows[item.productId].push(item)
    })
    for (const key in allSkuSelectedRows) {
      const id = Number(key)
      const item = Object.assign({}, allSkuSelectedRows[id][0])
      this.selectRows.push({
        id: Number(id),
        productName: item.productName,
        coverUrl: item.coverUrl,
        skuList: allSkuSelectedRows[id]
      } as Shop.ShopItemProps)
    }
    // this.selectRows = value.spuList || this.selectRows
    const spuSelectedRowKeys: {[spuId: number]: any[]} = {}
    this.selectRows.map((item) => {
      spuSelectedRowKeys[item.id] = item.skuList.map((item2) => {
        return item2.skuId
      })
    }),
    this.setState({
      selectedRowKeys: this.selectRows.map((item) => item.id),
      spuSelectedRowKeys,
      visible: true,
      type
    })
  }
  public hide () {
    this.setState({
      visible: false
    })
  }
  public onRowSelectionChange (selectedRowKeys: any[], selectedRows: Shop.ShopItemProps[]) {
    this.setState({
      selectedRowKeys: selectedRowKeys
    })
  }
  public onRowSelectionSelect (record: Shop.ShopItemProps, selected: boolean) {
    const spuSelectedRowKeys = this.state.spuSelectedRowKeys
    const isExist = this.selectRows.find((item) => item.id === record.id)
    if (selected) {
      spuSelectedRowKeys[record.id] = record.skuList.map((item) => item.skuId)
    } else {
      delete spuSelectedRowKeys[record.id]
    }
    if (selected && !isExist) {
      this.selectRows.push(record)
    } else if (!selected && isExist) {
      this.selectRows = this.selectRows.filter((item) => item.id !== record.id)
    }
    this.setState({
      spuSelectedRowKeys: spuSelectedRowKeys
    })
  }
  public onRowSelectionSelectAll (selected: boolean, selectedRows: Shop.ShopItemProps[], changeRows: Shop.ShopItemProps[]) {
    if (selected) {
      changeRows.map((item) => {
        this.selectRows.push(item)
      })
    } else {
      this.selectRows = this.selectRows.filter((item) => {
        return !changeRows.find(val => val.id === item.id)
      })
    }
    this.filterRows()
  }
  public filterRows () {
    const spuSelectedRowKeys: {[spuId: number]: number[]} = {}
    const selectRows: Shop.ShopItemProps[] = []
    this.selectRows.map((item) => {
      const id = item.id
      if (!(spuSelectedRowKeys[id] instanceof Array)) {
        spuSelectedRowKeys[id] = (item.skuList || []).map((item) => item.skuId)
        selectRows.push(item)
      }
    })
    this.selectRows = selectRows
    this.setState({
      spuSelectedRowKeys
    })
  }
  public render () {
    const { visible, dataSource, selectedRowKeys } = this.state
    const rowSelection: TableRowSelection<Shop.ShopItemProps> = {
      selectedRowKeys,
      onSelect: this.onRowSelectionSelect,
      onSelectAll: this.onRowSelectionSelectAll,
      onChange: this.onRowSelectionChange
    }
    const columns = this.state.type === 'spu' ? this.columns.filter((item) => item.title !== '价格') : this.columns
    return (
      <div>
        <Modal
          width={1200}
          visible={visible}
          title='请选择商品'
          onOk={this.onOk}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
        >
          <div className={styles['shop-select-modal']}>
            <div>
              <Form
                className='mb10'
                layout='inline'
                getInstance={(ref) => {
                  this.form = ref
                }}
              >
                <FormItem
                  label='商品ID'
                  name='productId'
                  type='number'
                  placeholder='请输入商品ID'
                  controlProps={{
                    style: {
                      width: 120
                    }
                  }}
                />
                <FormItem
                  label='商品名称'
                  name='productName'
                  placeholder='请输入商品名称'
                  controlProps={{
                    style: {
                      width: 130
                    }
                  }}
                />
                <FormItem
                  label='状态'
                  name='status'
                  type='select'
                  options={[
                    { label: '已上架', value: '0' },
                    { label: '已下架', value: '1' },
                    { label: '待上架', value: '3' },
                    { label: '商品池', value: '2' }
                  ]}
                />
                <FormItem
                  label='一级类目'
                  inner={(form) => {
                    return form.getFieldDecorator('categoryId')(
                      <SelectFetch
                        style={{ width: 172 }}
                        fetchData={api.getCategoryTopList}
                      />
                    )
                  }}
                />
                <FormItem
                >
                  <Button
                    type='primary'
                    className='mr10'
                    onClick={() => {
                      const value = this.form.props.form.getFieldsValue()
                      value.categoryIds = value.categoryIds && value.categoryIds.join(',')
                      this.payload = Object.assign(
                        {},
                        this.payload,
                        value,
                        { page: 1 }
                      )
                      this.fetchData()
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      const value = this.form.props.form.resetFields()
                      this.payload = {
                        page: 1,
                        pageSize: this.payload.pageSize
                      }
                      this.fetchData()
                    }}
                  >
                    重置
                  </Button>
                </FormItem>
              </Form>
            </div>
            <Table
              rowSelection={rowSelection}
              bordered
              rowKey='id'
              columns={columns}
              dataSource={dataSource}
              pagination={{
                total: this.state.total,
                pageSize: this.state.pageSize,
                current: this.state.page,
                onChange: (current) => {
                  this.payload.page = current
                  this.fetchData()
                }
              }}
            />
          </div>
        </Modal>
      </div>
    )
  }
}
export default Main
