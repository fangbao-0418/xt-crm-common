import React from 'react'
import { Modal, Table, Button } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import * as api from '../../api'
import Form, { FormItem, FormInstance } from '@/components/form'
import CategoryCascader from '@/components/category-cascader'
import SkuTable from './SkuTable'
import styles from './style.module.sass'
interface State {
  visible: boolean
  dataSource: Shop.ShopItemProps[]
  selectedRowKeys: number[]
  total: number
  page: number
  pageSize: number
  allSkuSelectedRowKeys: {[spuId: number]: number[]}
}
interface Props {
  getInstance?: (ref?: Main) => void
  onOk?: (rows: Shop.ShopItemProps[]) => void
}
export type ShopModalInstance = Main
interface PayloadProps {
  productId?: any
  productName?: string
  status?: number
  categoryIds?: string
  page?: number
  pageSize?: number
}
class Main extends React.Component<Props, State> {
  public payload: PayloadProps = {
    page: 1,
    pageSize: 10
  }
  public selectRows: Shop.ShopItemProps[] = []
  public allSkuSelectedRows: {[spuId: number]: Shop.SkuProps[]} = {}
  public form: FormInstance
  public columns: ColumnProps<Shop.ShopItemProps>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50
    },
    {
      title: '商品',
      width: 240,
      dataIndex: 'productName',
      render: (text, record) => {
        return (
          <div className={styles.shop}>
            <div className={styles['shop-img']}>
              <img
                src={record.coverUrl}
                width={80}
                height={80}
              />
            </div>
            <div className={styles['shop-right']} >
              <div>{record.productName}</div>
              <div>库存：{record.stock}</div>
            </div>
          </div>
        )
      }
    },
    {
      title: '类目',
      width: 100
    },
    {
      title: '价格',
      render: (text, record) => {
        let skuSelectedRowKeys = this.state.allSkuSelectedRowKeys[record.id] || []
        return (
          <SkuTable
            key={record.id}
            dataSource={record.skuList}
            allSelected={this.state.selectedRowKeys.indexOf(record.id) > -1}
            selectedRowKeys={skuSelectedRowKeys}
            onSelect={(rowKeys, rows) => {
              let { selectedRowKeys } = this.state
              const isExist = selectedRowKeys.indexOf(record.id) > -1
              this.state.allSkuSelectedRowKeys[record.id] =  rowKeys
              this.allSkuSelectedRows[record.id] = rows
              if (rowKeys.length > 0 && !isExist) {
                selectedRowKeys = selectedRowKeys.concat([record.id])
                this.selectRows = this.selectRows.concat([{
                  ...record,
                  skuList: rows
                }])
              } else if (rowKeys.length === 0 && isExist) {
                selectedRowKeys = selectedRowKeys.filter((id) => id !== record.id)
                this.selectRows = this.selectRows.filter((item) => record.id !== record.id)
                delete this.state.allSkuSelectedRowKeys[record.id]
                delete this.allSkuSelectedRows[record.id]
              }
              this.setState({
                selectedRowKeys: selectedRowKeys,
                allSkuSelectedRowKeys: this.state.allSkuSelectedRowKeys
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
    allSkuSelectedRowKeys: [],
    total: 0
  }
  public constructor (props: Props) {
    super(props)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.onOk = this.onOk.bind(this)
  }
  public componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
    }
    this.fetchData()
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
    this.selectRows = this.selectRows.map((item) => {
      item.skuList = this.allSkuSelectedRows[item.id] || []
      return item
    })
    if (this.props.onOk) {
      this.props.onOk([
        ...this.selectRows
      ])
    }
  }
  public open (value?: any) {
    console.log(value, 'xxxxx')
    this.setState({
      selectedRowKeys: Object.keys(value.spuIds).map(val => Number(val)),
      allSkuSelectedRowKeys: value.spuIds,
      visible: true
    })
  }
  public hide () {
    this.setState({
      visible: false
    })
  }
  public onSelectChange (selectedRowKeys: any[], selectedRows: Shop.ShopItemProps[]) {
    const allSkuSelectedRowKeys = this.state.allSkuSelectedRowKeys
    const newAllSkuSelectedRowKeys: {[spuId: number]: number[]} = {}
    const newAllSkuSelectedRows: {
      [spuId: number]: Shop.SkuProps[];
    } = {}
    this.selectRows = []
    selectedRows.map((item) => {
      newAllSkuSelectedRowKeys[item.id] = []
      // 存在选择的sku不作处理，不存在默认全部选择
      if (allSkuSelectedRowKeys[item.id]) {
        this.selectRows.push({
          ...item,
          skuList: this.allSkuSelectedRows[item.id]
        })
        newAllSkuSelectedRowKeys[item.id] = allSkuSelectedRowKeys[item.id]
        newAllSkuSelectedRows[item.id] = this.allSkuSelectedRows[item.id]
      } else {
        this.selectRows.push(item)
        newAllSkuSelectedRows[item.id] = [...item.skuList]
        item.skuList && item.skuList.map((skuItem) => {
          newAllSkuSelectedRowKeys[item.id].push(skuItem.skuId)
        })
      }
    })
    this.allSkuSelectedRows = newAllSkuSelectedRows
    this.setState({
      selectedRowKeys,
      allSkuSelectedRowKeys: newAllSkuSelectedRowKeys
    })
  }
  public render () {
    const { visible, dataSource, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    }
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
                    {label: '已上架', value: '0'},
                    {label: '已下架', value: '1'},
                  ]}
                />
                <FormItem
                  label='类目'
                  inner={(form) => {
                    return form.getFieldDecorator('categoryIds')(
                      <CategoryCascader />
                    )
                  }}
                >
                </FormItem>
                <FormItem
                >
                  <Button
                    type='primary'
                    onClick={() => {
                      const value = this.form.props.form.getFieldsValue()
                      value.categoryIds = value.categoryIds && value.categoryIds.join(',')
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
                </FormItem>
              </Form>
            </div>
            <Table
              rowSelection={rowSelection}
              bordered
              rowKey='id'
              columns={this.columns}
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
