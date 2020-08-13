import React from 'react'
import { Modal, Table, Button } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import * as api from './api'
import Image from '@/components/Image'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { formatDate, formatMoneyWithSign } from '@/pages/helper';
interface State {
  visible: boolean
  dataSource: Shop.ShopItemProps[]
  selectedRowKeys: number[]
  total: number
  page: number
  pageSize: number
}
interface Props {
  getInstance?: (ref: Main) => void
  onOk?: (rows: Shop.ShopItemProps[], hide: () => void) => void
}
export type ShopModalInstance = Main
interface PayloadProps {
  productId?: any
  productName?: string
  status?: number
  categoryIds?: string
  page: number
  pageSize: number
  enableStatus?: 0 | 1
  enableHb?: 0 | 1
}
class Main extends React.Component<Props, State> {
  public payload: PayloadProps = {
    page: 1,
    pageSize: 10,
    status: 0,
    enableHb: 0,
    enableStatus: 0
  }
  public selectRows: Shop.ShopItemProps[] = []
  public form: any
  public columns: ColumnProps<Shop.ShopItemProps>[] = [
    {
      title: '商品ID',
      dataIndex: 'id',
      width: 100
    },
    {
      title: '主图',
      dataIndex: 'coverUrl',
      width: 120,
      render: (text) => {
        return (
          <div>
            <Image
              src={text}
            />
          </div>
        )
      }
    },
    {
      title: '商品名称',
      width: 100,
      dataIndex: 'productName'
    },
    {
      title: '上架状态',
      width: 100,
      dataIndex: 'status',
      render: (text) => {
        const statusEnum = ['已下架', '已上架']
        return statusEnum[text]
      }
    },
    {
      title: '供应商',
      dataIndex: 'storeName',

    },
    {
      title: '销售价',
      dataIndex: 'salePrice',
      render: (text) => formatMoneyWithSign(text)
    }
  ]
  public state: State = {
    visible: false,
    dataSource: [],
    selectedRowKeys: [],
    page: this.payload.page,
    pageSize: this.payload.pageSize,
    total: 0
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
    return api.fetchSelectShopList(this.payload).then((res: any) => {
      this.setState({
        dataSource: res.records || [],
        total: res.total
      })
    })
  }
  public onOk () {
    console.log(this.selectRows, 'on ok')
    if (this.props.onOk) {
      this.props.onOk([
        ...this.selectRows
      ], this.hide.bind(this))
    }
  }
  public open (value?: any[]) {
    this.selectRows = []
    this.payload = {
      ...this.payload,
      page: 1,
      pageSize: 10,
    }
    if (this.form) {
      this.form.props.form.resetFields()
    }
    this.fetchData().then(() => {
      this.setState({
        selectedRowKeys: [],
        visible: true
      })
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
    const isExist = this.selectRows.find((item) => item.id === record.id)
    if (selected && !isExist) {
      this.selectRows.push(record)
    } else if (!selected && isExist) {
      this.selectRows = this.selectRows.filter((item) => item.id !== record.id)
    }
  }
  public onRowSelectionSelectAll (selected: boolean, selectedRows: Shop.ShopItemProps[],  changeRows: Shop.ShopItemProps[]) {
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
    const spuSelectedRowKeys: {[spuId: number]: boolean} = {}
    const selectRows: Shop.ShopItemProps[] = []
    this.selectRows.map((item) => {
      const id = item.id
      if (!(spuSelectedRowKeys[id])) {
        spuSelectedRowKeys[id] = true
        selectRows.push(item)
      }
    })
    this.selectRows = selectRows
  }
  public render () {
    const { visible, dataSource, selectedRowKeys } = this.state
    const rowSelection: TableRowSelection<Shop.ShopItemProps> = {
      selectedRowKeys,
      onSelect: this.onRowSelectionSelect,
      onSelectAll: this.onRowSelectionSelectAll,
      onChange: this.onRowSelectionChange
    }
    const columns = this.columns
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
          <div>
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
                  placeholder='请输入商品ID'
                  controlProps={{
                    type: 'number',
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
                {/* <FormItem
                  label='供应商'
                  name='productName'
                  placeholder='请输入供应商'
                  controlProps={{
                    style: {
                      width: 130
                    }
                  }}
                /> */}
                <FormItem
                  label='状态'
                  name='status'
                  type='select'
                  options={[
                    {label: '已上架', value: 1},
                    {label: '已下架', value: 0},
                  ]}
                />
                <FormItem
                >
                  <Button
                    type='primary'
                    className='mr10'
                    onClick={() => {
                      const value = this.form.props.form.getFieldsValue()
                      if (value.status === undefined) {
                        value.enableStatus = 0
                      } else {
                        value.enableStatus = 1
                      }
                      this.payload = Object.assign(
                        {},
                        this.payload,
                        value,
                        {page: 1}
                      )
                      this.fetchData()
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      const value = this.form.props.form.resetFields()
                      this.payload =  {
                        enableStatus: 0,
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
