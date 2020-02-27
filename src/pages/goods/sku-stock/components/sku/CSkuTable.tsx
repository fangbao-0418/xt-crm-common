import React from 'react';
import { Table, Input, InputNumber, Form } from 'antd';
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form';
import { PaginationConfig } from 'antd/lib/pagination'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert';
import { ArrowContain, InputMoney } from '@/packages/common/components';
import { isFunction } from 'lodash';
import { CSkuProps } from '../sku';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
const FormItem = Form.Item;

interface CSkuTableProps extends Partial<AlertComponentProps>, FormComponentProps {
  id: number,
  extraColumns?: ColumnProps<any>[];
  dataSource: CSkuProps[];
  onChange?: (dataSource: CSkuProps[]) => void;
}
interface CSkuTableState {
  dataSource: CSkuProps[]
}
class CSkuTable extends React.Component<CSkuTableProps, CSkuTableState> {
  pagination: PaginationConfig = {
    current: 1,
    pageSize: 10
  }
  constructor(props: CSkuTableProps) {
    super(props);
    this.state = {
      dataSource: props.dataSource
    }
  }
  componentWillReceiveProps (props: CSkuTableProps) {
    this.setState({
      dataSource: props.dataSource
    })
  }
  getColumns(): ColumnProps<CSkuProps>[] {
    const { dataSource } = this.state;
    const cb = this.handleChangeValue;
    return this.props.id === -1 ? [{
      title: '单位',
      dataIndex: 'unit',
      width: 200,
      render: (text, record, index) => {
        return (
          this.speedyInput('unit', text, record, index, dataSource, cb)(
            <Input
              maxLength={10}
              value={text}
              placeholder='请输入单位'
              onChange={cb('unit', record, index)}
            />
          )
        )
      }
    }, {
      title: '规格条码',
      dataIndex: 'barCode',
      render: (text: any, record: any, index: any) => {
        return this.speedyInput('barCode', text, record, index, dataSource, cb)(
          <Input
            value={text}
            placeholder='请输入规格条码'
            onChange={cb('barCode', record, index)}
          />
        )
      }
    }, {
      title: '市场价',
      dataIndex: 'marketPrice',
      render: (text: any, record: any, index: any) => {
        return this.speedyInput('marketPrice', text, record, index, dataSource, cb, {
          rules: [{
            required: true,
            message: '请输入市场价'
          }]
        })(
          <InputMoney
            min={0.01}
            precision={2}
            placeholder='请输入市场价'
          />
        )
      }
    }, {
      title: '成本价',
      dataIndex: 'costPrice',
      render: (text: any, record: any, index: any) => {
        return this.speedyInput('costPrice', text, record, index, dataSource, cb, {
          rules: [{
            required: true,
            message: '请输入成本价'
          }]
        })(
          <InputMoney
            min={0.01}
            precision={2}
            placeholder='请输入成本价'
          />
        )
      }
    }, {
      title: '库存',
      dataIndex: 'stock',
      render: (text: any, record, index: any) => (
        this.speedyInput('stock', text, record, index, dataSource, cb)(
          <InputNumber
            precision={0}
            min={0}
            value={text}
            placeholder="请输入库存"
            onChange={cb('stock', record, index)}
          />
        )
      )
    }]: [
      {
        title: '单位',
        dataIndex: 'unit',
        width: 200,
        render: (text, record, index) => {
          return (
            this.speedyInput('marketPrice', text, record, index, dataSource, cb)(
              <Input
                maxLength={10}
                value={text}
                placeholder='请输入单位'
                onChange={cb('marketPrice', record, index)}
              />
            )
          )
        }
      },
      {
        title: '规格条码',
        dataIndex: 'barCode',
        render: (text: any, record: any, index: any) => {
          return this.speedyInput('barCode', text, record, index, dataSource, cb)(
            <Input
              value={text}
              placeholder='请输入规格条码'
              onChange={cb('barCode', record, index)}
            />
          )
        }
      },
      {
        title: '规格编码',
        dataIndex: 'skuCode'
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        render: (text: any, record: any, index: any) => {
          return this.speedyInput('marketPrice', text, record, index, dataSource, cb, {
            rules: [{
              required: true,
              message: '请输入市场价'
            }]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder='请输入市场价'
            />
          )
        }
      }, {
        title: '成本价',
        dataIndex: 'costPrice',
        render: (text: any, record: any, index: any) => {
          return this.speedyInput('costPrice', text, record, index, dataSource, cb, {
            rules: [{
              required: true,
              message: '请输入成本价'
            }]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder='请输入成本价'
            />
          )
        }
      }, {
        title: '库存',
        dataIndex: 'stock',
        render: (text: any, record, index: any) => (
          this.speedyInput('stock', text, record, index, dataSource, cb)(
            <InputNumber
              precision={0}
              min={0}
              value={text}
              placeholder="请输入库存"
              onChange={cb('stock', record, index)}
            />
          )
        )
      }
    ]
  }
  speedyInputCallBack = (dataSource: CSkuProps[]) => {
    const { onChange } = this.props;
    if (isFunction(onChange)) {
      onChange([...dataSource])
    }
  }
  // 快速填充
  speedyInput (field: string, text: any, record: CSkuProps, index: number, dataSource: CSkuProps[], cb?: any, fieldDecoratorOptions?: GetFieldDecoratorOptions) {
    const { pageSize = 10, current = 1 } = this.pagination
    const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index
    const { getFieldDecorator } = this.props.form
    return (node: React.ReactNode) => {
      return (
        <FormItem
          wrapperCol={{span: 24}}
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
              while (currentIndex <= end) {
                dataSource[currentIndex][field] = text as never
                currentIndex++
              }
              this.speedyInputCallBack(dataSource)
            }}
          >
            {fieldDecoratorOptions ?
              getFieldDecorator(`${field}-${index}`, {
                getValueFromEvent(e) {
                  let value: string | number = '';
                  if (!e || !e.target) {
                    value = e;
                  } else {
                    const { target } = e;
                    value = target.type === 'checkbox' ? target.checked : target.value;
                  }
                  cb(field, record, index)(value);
                  return value;
                },
                ...fieldDecoratorOptions
              })(node)
            : node}
          </ArrowContain>
        </FormItem>
      );
    }
  }
    
  handleChangeValue = (field: string, record: any, index: any) => (e: any) => {
    const { pageSize = 10, current = 1 } = this.pagination
    const realIndex = current > 1 ? pageSize * (current - 1) + index : index
    const value = (e && e.target ? e.target.value : e) as never
    const dataSource = this.props.dataSource
    dataSource[realIndex][field] = value
    const { onChange } = this.props;
    if (isFunction(onChange)) {
      onChange([...dataSource])
    }
  }
  render() {
    const { dataSource } = this.state;
    const columns = (this.props.extraColumns || []).concat(this.getColumns());
    return (
      <Table
        rowKey='id'
        title={() => '规格明细'}
        columns={columns}
        dataSource={dataSource}
        onChange={(pagination) => {
          this.pagination = pagination
        }}
      />
    );
  }
}

export default Alert(CSkuTable);