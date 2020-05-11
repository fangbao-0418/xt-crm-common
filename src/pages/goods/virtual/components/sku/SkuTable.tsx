import React from 'react'
import { Table, Select, Input, Button, Form, InputNumber } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form'
import { PaginationConfig } from 'antd/lib/pagination'
import ArrowContain from '@/pages/goods/components/arrow-contain'
import { SkuSaleProps } from './index'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import InputMoney from '@/packages/common/components/input-money'
import styles from './style.module.scss'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form'
const { Option } = Select
const FormItem = Form.Item
interface Props extends Partial<AlertComponentProps>, FormComponentProps {
  extraColumns?: ColumnProps<any>[]
  dataSource: SkuSaleProps[]
  onChange?: (dataSource: SkuSaleProps[]) => void
  getInstance?: (ref: any) => void
  /** 0-普通商品，10-一般海淘商品，20-保税仓海淘商品 */
  type: 0 | 10 | 20
}

const deliveryModeOptions = [
  { key: 2, val: '供货商发货' },
  { key: 3, val: '其他' }
]

interface State {
  dataSource: SkuSaleProps[];
  selectedRowKeys: any[];
  selectedRowKeysMap: any;
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
  public componentWillMount () {
    if (this.props.getInstance) {
      this.props.getInstance(this)
    }
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
  };
  // 快速填充
  public speedyInput (
    field: string,
    text: any,
    record: SkuSaleProps,
    index: number,
    dataSource: SkuSaleProps[],
    cb?: any,
    fieldDecoratorOptions?: GetFieldDecoratorOptions
  ) {
    const { pageSize = 10, current = 1 } = this.pagination
    const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index
    return (node: React.ReactNode) => {
      return (
        <FormItem wrapperCol={{ span: 24 }}>
          <ArrowContain
            disabled={dataSource.length <= 1}
            type={(realIndex === 0 && 'down') || (realIndex === dataSource.length - 1 && 'up') || undefined}
            onClick={type => {
              // const value = text
              let currentIndex = 0
              let end = realIndex
              if (type === 'down') {
                currentIndex = realIndex
                end = dataSource.length - 1
              }
              const fields: any = []
              while (currentIndex <= end) {
                fields.push(`${field}-${currentIndex}`)
                dataSource[currentIndex][field] = text as never
                currentIndex++
              }
              this.props.form.resetFields(fields)
              this.speedyInputCallBack(dataSource)
            }}
          >
            {fieldDecoratorOptions
              ? this.props.form
                && this.props.form.getFieldDecorator(`${field}-${realIndex}`, {
                  initialValue: text,
                  getValueFromEvent (e) {
                    let value: string | number = ''
                    if (!e || !e.target) {
                      value = e
                    } else {
                      const { target } = e
                      value = target.type === 'checkbox' ? target.checked : target.value
                    }
                    cb(field, record, index)(value)
                    return value
                  },
                  ...fieldDecoratorOptions
                })(node)
              : node}
          </ArrowContain>
        </FormItem>
      )
    }
  }

  public getColumns (cb: any, dataSource: SkuSaleProps[]): ColumnProps<SkuSaleProps>[] {
    const validateColumnsFields = (index: number) => {
      const { pageSize = 10, current = 1 } = this.pagination
      const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index
      this.props.form
        && this.props.form.validateFields(
          ['salePrice'].map(
            key => `${key}-${realIndex}`
          )
        )
    }
    const differentColumns = [
      {
        title: '供应商skuid',
        dataIndex: 'storeProductSkuId',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              value={text}
              placeholder='请输入供应商skuid'
              onChange={cb('storeProductSkuId', record, index)}
            />
          )
        }
      },
      {
        title: '发货方式',
        dataIndex: 'deliveryMode',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Select
              value={text}
              placeholder='请选择'
              onChange={cb('deliveryMode', record, index)}
            >
              {deliveryModeOptions.map(item => (
                <Option value={item.key} key={item.key}>
                  {item.val}
                </Option>
              ))}
            </Select>
          )
        }
      }
    ]
    return [
      ...differentColumns,
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return this.speedyInput('marketPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                required: true,
                message: '请输入市场价'
              }
            ]
          })(<InputMoney min={0.01} precision={2} placeholder='请输入市场价' />)
        }
      },
      {
        title: '成本价',
        dataIndex: 'costPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('costPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                required: true,
                message: '请输入成本价'
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder='请输入成本价'
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        width: 200,
        render: (text, record, index: any) =>
          this.speedyInput('salePrice', text, record, index, dataSource, cb, {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb('请输入销售价')
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2
                        || ''} 销售价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    })
                  }
                  cb()
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder='请输入销售价'
              onBlur={() => validateColumnsFields(index)}
            />
          )
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
  };

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
          onChange={pagination => {
            this.pagination = pagination
          }}
        />
      </>
    )
  }
}
export default Alert(Main)
