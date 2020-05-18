import React from 'react'
import { Table, Select, Input, Button, Form, InputNumber } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form'
import { PaginationConfig } from 'antd/lib/pagination'
import ArrowContain from '../arrow-contain'
import { SkuSaleProps } from './index'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import InputMoney from '@/packages/common/components/input-money'
import styles from './style.module.scss'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form'
import { pick } from 'lodash'
import * as api from '../../api'
const FormItem = Form.Item
interface Props extends Partial<AlertComponentProps>, FormComponentProps {
  extraColumns?: ColumnProps<any>[]
  dataSource: SkuSaleProps[]
  onChange?: (dataSource: SkuSaleProps[]) => void
}

// 通过返回数据拿到id到规格详情的映射关系
function getSelectedRowKeysMap (data: any[]) {
  const result: any = {}
  for (const item of data) {
    if (result[item.id]) {
      result[item.id] = result[item.id].concat([item.productBasicSkuId])
    } else {
      result[item.id] = [item.productBasicSkuId]
    }
  }
  return result
}

function combination (data: any[]) {
  data = data || []
  const keysMap: any = {}
  const result: any[] = []
  for (const item of data) {
    const record = {
      ...pick(item, [
        'num',
        'id',
        'productName',
        'status',
        'categoryId',
        'categoryName',
        'productCode',
        'barCode',
        'productMainImage'
      ]),
      productBasicSkuInfos: [pick(item, [
        'productBasicSkuId',
        'productBasicSkuCode',
        'productBasicSkuBarCode',
        'productBasicSpuCode',
        'propertyValue',
        'marketPrice',
        'costPrice',
        'totalStock'
      ])]
    }
    if (keysMap[item.id]) {
      keysMap[item.id].productBasicSkuInfos = [...keysMap[item.id].productBasicSkuInfos, record];
    } else {
      keysMap[item.id] = record
      result.push(record)
    }
  }
  console.log('result =>', result)
  return result
}

interface State {
  dataSource: SkuSaleProps[];
  selectedRowKeys: any[],
  selectedRowKeysMap: any
}

class Main extends React.Component<Props, State> {
  public pagination: PaginationConfig = {
    current: 1,
    pageSize: 10
  }
  public state: State = {
    dataSource: this.props.dataSource || [],
    selectedRowKeys: [],
    selectedRowKeysMap: []
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      dataSource: props.dataSource
    })
  }
  public speedyInputCallBack = (dataSource: SkuSaleProps[]) => {
    if (this.props.onChange) {
      this.props.onChange([...dataSource])
    }
  }
  // 快速填充
  public speedyInput (field: string, text: any, record: SkuSaleProps, index: number, dataSource: SkuSaleProps[], cb?: any, fieldDecoratorOptions?: GetFieldDecoratorOptions) {
    const { pageSize = 10, current = 1 } = this.pagination
    const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index
    return (node: React.ReactNode) => {
      return (
        <FormItem
          wrapperCol={{ span: 24 }}
        >
          <ArrowContain
            disabled={dataSource.length <= 1}
            type={(realIndex === 0 && 'down' || realIndex === dataSource.length - 1 && 'up' || undefined)}
            onClick={(type) => {
              // const value = text
              let currentIndex = 0
              let end = realIndex
              if (type === 'down') {
                currentIndex = realIndex
                end = dataSource.length - 1
              }
              let fields: any = []
              while (currentIndex <= end) {
                fields.push(`${field}-${currentIndex}`);
                dataSource[currentIndex][field] = text as never
                currentIndex++
              }
              this.props.form.resetFields(fields);
              this.speedyInputCallBack(dataSource)
            }}
          >
            {fieldDecoratorOptions ? this.props.form && this.props.form.getFieldDecorator(`${field}-${realIndex}`, {
              initialValue: text,
              getValueFromEvent (e) {
                let value: string | number = ''
                if (!e || !e.target) {
                  value = e
                } else {
                  const { target } = e
                  value = target.type === 'checkbox' ? target.checked : target.value
                }
                cb(field, record, realIndex)(value)
                return value
              },
              ...fieldDecoratorOptions
            })(node) : node}
          </ArrowContain>
        </FormItem>
      )
    }
  }

  public getColumns (cb: any, dataSource: SkuSaleProps[]): ColumnProps<SkuSaleProps>[] {
    const validateColumnsFields = (index:number) => {
      const { pageSize = 10, current = 1 } = this.pagination
      const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index
      if (this.props.form) {
        this.props.form.validateFields(
          ['costPrice', 'salePrice', 'headPrice', 'areaMemberPrice', 'unit', 'cityMemberPrice', 'managerMemberPrice'].map(key => `${key}-${realIndex}`)
        )
      }
    }
    return [
      {
        title: '规格编码',
        dataIndex: 'skuCode',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              value={text}
              placeholder='请输入规格编码'
              onChange={cb('skuCode', record, index)}
            />
          )
        }
      },
      {
        title: (<><span className='error'>*</span>成本价</>),
        dataIndex: 'costPrice',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return this.speedyInput('costPrice', text, record, index, dataSource, cb, {
            rules: [{
              validator: (rule, value, cb) => {
                if (!value) {
                  cb('请输入成本价')
                } else if (value < 0.01) {
                  cb('不能小于0.01')
                }
                cb()
              }
            }]
          })(
            <InputMoney
              precision={2}
              placeholder='请输入成本价'
            />
          )
        }
      },
      {
        title: (<><span className='error'>*</span>市场价</>),
        dataIndex: 'marketPrice',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return this.speedyInput('marketPrice', text, record, index, dataSource, cb, {  
            rules: [{
              validator: (rule, value, cb) => {
                if (!value) {
                  cb('请输入市场价')
                } else if (value < 0.01) {
                  cb('不能小于0.01')
                }
                cb()
              }
            }]
          })(
            <InputMoney
              precision={2}
              placeholder='请输入市场价'
            />
          )
        }
      },
      {
        title: (<><span className='error'>*</span>销售价</>),
        dataIndex: 'salePrice',
        width: 200,
        render: (text, record, index: any) => (
          this.speedyInput('salePrice', text, record, index, dataSource, cb, {
            rules: [{
              validator: (rule, value, cb) => {
                if (!value) {
                  cb('请输入销售价')
                } else if (value < 0.01) {
                  cb('不能小于0.01')
                }
                cb()
              }
            }]
          })(
            <InputMoney
              precision={2}
              placeholder='请输入销售价'
              onBlur={() => validateColumnsFields(index)}
            />
          )
        )
      },
      {
        title: (<>库存</>),
        dataIndex: 'stock',
        width: 200,
        render: (text: any, record, index: any) => (
          this.speedyInput('stock', text, record, index, dataSource, cb)(
            <InputNumber
              precision={0}
              min={0}
              value={text}
              placeholder='请输入库存'
              onChange={cb('stock', record, index)}
            />
          )
        )
      },
      {
        title: (<><span className='error'>*</span>单位</>),
        dataIndex: 'unit',
        width: 200,
        render: (text: any, record, index: any) => (
          this.speedyInput('unit', text, record, index, dataSource, cb, {
            rules: [{
              required: true, message: '单位不能为空'
            }]
          })(
            <Input
              value={text}
              maxLength={5}
              placeholder='请输入单位'
              onChange={cb('unit', record, index)}
            />
          )
        )
      },
      {
        title: '自提分佣%',
        dataIndex: 'commissionPercentage',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('commissionPercentage', text, record, index, dataSource, cb)(
            <InputNumber
              precision={2}
              min={0}
              max={100}
              value={text}
              onChange={cb('commissionPercentage', record, index)}
            />
          )
        )
      },
      {
        title: '操作',
        dataIndex: 'status',
        width: 100,
        align: 'center',
        render: (text, record, index) => {
          return (
            <div>
              {!!record.skuId && (
                <span
                  className='href'
                  onClick={() => {
                    // api.updateSkuStatus({
                    //   skuId: record.skuId,
                    //   type: text === -1 ? 1 : 0
                    // }).then(() => {
                    //   cb('status', record, index)(text === -1 ? 0 : -1)
                    // })
                    const dataSource = this.state.dataSource || []
                    const res = dataSource.filter((item) => {
                      return item.status !== -1
                    })
                    if (res.length <= 1) {
                      APP.error('最少存在一个sku不能被停用')
                      return
                    }
                    cb('status', record, index)(text === -1 ? 0 : -1)
                  }}
                >
                  {text === -1 ? '取消停用' : '停用'}
                </span>
              )}
            </div>
          )
        }
      }
    ]
  }
  public handleChangeValue = (field: string, record: any, index: any) => (e: any) => {
    const { pageSize = 10, current = 1 } = this.pagination
    const realIndex = current > 1 ? pageSize * (current - 1) + index : index
    const value = (e && e.target ? e.target.value : e) as never
    const dataSource = this.props.dataSource
    dataSource[realIndex][field] = value
    if (this.props.onChange) {
      this.props.onChange([...dataSource])
    }
  }
  public render () {
    const columns = (this.props.extraColumns || []).concat(this.getColumns(this.handleChangeValue, this.state.dataSource))
    return (
      <>
        <Table
          rowKey={(_, idx) => idx + ''}
          className={styles['sku-table']}
          style={{ marginTop: 10 }}
          scroll={{ x: true }}
          columns={columns}
          dataSource={this.state.dataSource}
          onChange={(pagination) => {
            this.pagination = pagination
          }}
        />
      </>
    )
  }
}
export default Alert(Main)
