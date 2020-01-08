import React from 'react'
import { Modal, Table, Button } from 'antd'
import { ColumnProps, TableRowSelection } from 'antd/lib/table'
import * as api from '../../api'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from '../../config'
import CategoryCascader from '@/components/category-cascader'
import styles from './style.module.sass'
interface State {
  visible: boolean
  dataSource: Marketing.ItemProps[]
  selectedRowKeys: number[]
  total: number
  page: number
  pageSize: number
}
interface Props {
  getInstance?: (ref: Main) => void
  onOk?: (rows: Marketing.ItemProps[]) => void
}
export type ActivityModalInstance = Main
interface PayloadProps {
  productId?: any
  productName?: string
  status?: number
  categoryIds?: string
  page: number
  pageSize: number
  /** 排除查询活动类型，1-限时秒杀，2-今日拼团，3-礼包，4-激活码，5-地推专区，6-体验团长专区，7-采购专区，8-买赠, 9-团购*/
  excludTypes?: Marketing.ActivityType[]
}
class Main extends React.Component<Props, State> {
  public payload: PayloadProps = {
    page: 1,
    pageSize: 10,
    excludTypes: [3, 4, 5, 6, 7, 8, 9]
  }
  public selectRows: Marketing.ItemProps[] = []
  public form: FormInstance
  public columns: ColumnProps<Marketing.ItemProps>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50
    },
    {
      title: '活动名称',
      width: 240,
      dataIndex: 'title'
    },
    {
      title: '开始时间',
      width: 100,
      dataIndex: 'startTime',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '结束时间',
      width: 100,
      dataIndex: 'endTime',
      render: (text) => {
        return APP.fn.formatDate(text)
      }
    },
    {
      title: '活动类型',
      width: 100,
      dataIndex: 'activityTypeName'
    },
    {
      title: '活动状态',
      width: 100,
      dataIndex: 'status',
      render: (text) => {
        return text === 0 ? '关闭' : '开启'
      }
    }
  ]
  public state: State = {
    visible: false,
    dataSource: [],
    selectedRowKeys: [],
    page: this.payload.page || 1,
    pageSize: this.payload.pageSize || 10,
    total: 0
  }
  public constructor (props: Props) {
    super(props)
    this.onRowSelectionChange = this.onRowSelectionChange.bind(this)
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
    api.fetchActivityList(this.payload).then((res: any) => {
      this.setState({
        dataSource: res.records || [],
        total: res.total
      })
    })
  }
  public onOk () {
    console.log(this.selectRows, 'this.selectRows')
    if (this.props.onOk) {
      this.props.onOk([
        ...this.selectRows
      ])
    }
  }
  public open (value?: Marketing.PresentContentValueProps, type: 'sku' | 'spu' = 'sku') {
    value = Object.assign({
      activityList: []
    }, value)
    this.payload = {
      excludTypes: this.payload.excludTypes,
      page: 1,
      pageSize: 10
    }
    if (this.form) {
      this.form.props.form.resetFields()
    }
    this.fetchData()
    const selectedRowKeys = (value.activityList || []).map((item) => item.id)
    this.setState({
      selectedRowKeys: selectedRowKeys,
      visible: true
    })
  }
  public hide () {
    this.setState({
      visible: false
    })
  }
  public onRowSelectionChange (selectedRowKeys: any[], selectedRows: Marketing.ItemProps[]) {
    this.selectRows = selectedRows
    this.setState({
      selectedRowKeys: selectedRowKeys
    })
  }
  public onRowSelectionSelectAll (selected: boolean, selectedRows: Marketing.ItemProps[],  changeRows: Marketing.ItemProps[]) {
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
    const spuSelectedRowKeys: {[id: number]: boolean} = {}
    const selectRows: Marketing.ItemProps[] = []
    this.selectRows.map((item) => {
      const id = item.id
      if (!(spuSelectedRowKeys[id])) {
        spuSelectedRowKeys[id] = true
        selectRows.push(item)
      }
    })
    this.selectRows = selectRows
    // this.setState({
    //   spuSelectedRowKeys
    // })
  }
  public render () {
    const { visible, dataSource, selectedRowKeys } = this.state
    const rowSelection: TableRowSelection<Marketing.ItemProps> = {
      type: 'radio',
      selectedRowKeys,
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
          <div className={styles['shop-select-modal']}>
            <div>
              <Form
                config={getFieldsConfig()}
                className='mb10'
                layout='inline'
                namespace='marketing'
                getInstance={(ref) => {
                  this.form = ref
                }}
              >
                <FormItem
                  label='活动ID'
                  name='promotionId'
                  controlProps={{
                    style: {
                      width: 120
                    }
                  }}
                />
                <FormItem
                  label='活动名称'
                  name='name'
                  controlProps={{
                    style: {
                      width: 130
                    }
                  }}
                />
                <FormItem
                  label='活动类型'
                  name='type'
                />
                <FormItem
                  label='状态'
                  name='status'
                  type='select'
                  options={[
                    {label: '开启', value: '1'},
                    {label: '关闭', value: '0'},
                  ]}
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
                        pageSize: this.payload.pageSize,
                        excludTypes: this.payload.excludTypes
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
