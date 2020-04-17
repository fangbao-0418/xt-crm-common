import React from 'react'
import { Modal, Table, Button } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import * as api from './api'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import CategoryCascader from '@/components/category-cascader'
import SkuTable from './SkuTable'
import Image from '@/components/Image'
import styles from './style.module.sass'
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
  /**
   * 设置table选中类型
   *
   * @type {('checkbox' | 'radio' | undefined)}
   * @memberof Props
   */
  checkType?: 'checkbox' | 'radio' | undefined
  columns?: []
  api?: (payload: any) => Promise<any>
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
      title: '商品ID',
      dataIndex: 'id',
      width: 150
    },
    {
      title: '商品名称',
      // width: 240,
      dataIndex: 'productName',
      render: (text, record) => {
        return (
          <div className={styles.shop}>
            <div className={styles['shop-img']}>
              <Image
                src={record.coverUrl}
                width={80}
                height={80}
              />
            </div>
            <div className={styles['shop-right']} >
              <div>{record.productName}</div>
              {/* <div>库存：{record.stock}</div> */}
            </div>
          </div>
        )
      }
    },
    {
      title: '库存',
      dataIndex: 'stock',
      width: 150,
      align: 'center',
      render: (text) => {
        return text
      }
    }
    // {
    //   title: '类目',
    //   width: 100,
    //   dataIndex: 'productCategoryAllName'
    // },
    // {
    //   title: '价格',
    //   width: 0,
    //   render: (text, record) => {
    //     let skuSelectedRowKeys = this.state.spuSelectedRowKeys[record.id] || []
    //     return (
    //       <SkuTable
    //         key={record.id}
    //         dataSource={record.skuList}
    //         allSelected={this.state.selectedRowKeys.indexOf(record.id) > -1}
    //         selectedRowKeys={skuSelectedRowKeys}
    //         onSelect={(rowKeys, rows = []) => {
    //           let { selectedRowKeys } = this.state
    //           const index = this.selectRows.findIndex((item) => item.id === record.id)
    //           const isExist = index > -1
    //           this.state.spuSelectedRowKeys[record.id] =  rowKeys
    //           if (rowKeys.length > 0) {
    //             if (!isExist) {
    //               selectedRowKeys = selectedRowKeys.concat([record.id])
    //               this.selectRows = this.selectRows.concat([{
    //                 ...record,
    //                 skuList: rows
    //               }])
    //             } else {
    //               this.selectRows[index].skuList = rows
    //             }
    //           } else if (rowKeys.length === 0 && isExist) {
    //             selectedRowKeys = selectedRowKeys.filter((id) => id !== record.id)
    //             this.selectRows = this.selectRows.filter((item) => item.id !== record.id)
    //             delete this.state.spuSelectedRowKeys[record.id]
    //           }
    //           this.setState({
    //             selectedRowKeys: selectedRowKeys,
    //             spuSelectedRowKeys: this.state.spuSelectedRowKeys
    //           })
    //         }}
    //       />
    //     )
    //   }
    // }
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
    // this.fetchData()
  }
  public fetchData () {
    this.setState({
      page: this.payload.page
    })
    if (this.props.api) {
      this.props.api(this.payload).then((res: any) => {
        this.setState({
          dataSource: res.records || [],
          total: res.total
        })
      })
    } else {
      api.fetchSelectShopList(this.payload).then((res: any) => {
        this.setState({
          dataSource: res.records || [],
          total: res.total
        })
      })
    }
  }
  public onOk () {
    if (this.props.onOk) {
      this.props.onOk([
        ...this.selectRows
      ])
    }
  }
  public open (value?: Marketing.PresentContentValueProps, type: 'sku' | 'spu' = 'sku') {
    this.payload = {
      page: 1,
      pageSize: 10
    }
    if (this.form) {
      this.form.props.form.resetFields()
    }
    this.fetchData()
    value = Object.assign({
      spuList: [],
      skuList: [],
      spuIds: {}
    }, value)
    const allSkuSelectedRows: {[spuId: number]: Shop.SkuProps[]} = {}
    this.selectRows = [];
    (value.skuList || []).map((item) => {
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
    this.selectRows = value.spuList || this.selectRows
    this.setState({
      selectedRowKeys: (value && value.spuList || []).map((item) => item.id),
      spuSelectedRowKeys: value.spuIds,
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
      selectedRowKeys
    })
  }
  /**
   * 处理筛选选中数据
   *
   * @param {Shop.ShopItemProps} record
   * @param {boolean} selected
   * @memberof Main
   */
  public onRowSelectionSelect (record: Shop.ShopItemProps, selected: boolean) {
    const spuSelectedRowKeys = this.state.spuSelectedRowKeys
    const { checkType = 'checkbox' } = this.props
    // 单选在每次触发选中的时候清空已有选中数据
    this.selectRows = checkType === 'checkbox' ? this.selectRows : []
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
      spuSelectedRowKeys
    })
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
    const { checkType = 'checkbox' } = this.props
    const rowSelection: TableRowSelection<Shop.ShopItemProps> = {
      selectedRowKeys,
      onSelect: this.onRowSelectionSelect,
      onSelectAll: this.onRowSelectionSelectAll,
      onChange: this.onRowSelectionChange,
      type: checkType
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
                {/* <FormItem
                  label='状态'
                  name='status'
                  type='select'
                  options={[
                    {label: '已上架', value: '0'},
                    {label: '已下架', value: '1'},
                  ]}
                /> */}
                {/* <FormItem
                  label='类目'
                  inner={(form) => {
                    return form.getFieldDecorator('categoryIds')(
                      <CategoryCascader />
                    )
                  }}
                >
                </FormItem> */}
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
