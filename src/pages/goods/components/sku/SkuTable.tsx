import React from 'react'
import { Table, Card, Select, Popover, Input, Button, message } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { deliveryModeType } from '@/enum';
import ArrowContain from '../arrow-contain'
import { SkuProps } from './index'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import InputMoney from '@/packages/common/components/input-money'
import Record from './Record'
import Stock from './Stock'
const { Option } = Select;

interface Props extends Partial<AlertComponentProps> {
  extraColumns?: ColumnProps<any>[]
  dataSource: SkuProps[]
  onChange?: (dataSource: SkuProps[]) => void
  /** 0-普通商品，10-一般海淘商品，20-保税仓海淘商品 */
  type: 0 | 10 | 20
}

interface State {
  dataSource: SkuProps[]
}

class Main extends React.Component<Props, State> {
  public state: State = {
    dataSource: this.props.dataSource || []
  }
  public componentWillReceiveProps (props: Props) {
    this.setState({
      dataSource: props.dataSource
    })
  }
  public speedyInput (field: string, text: any, record: SkuProps, index: number, dataSource: SkuProps[], cb: any) {
    return (node: React.ReactNode) => (
      <ArrowContain
        disabled={dataSource.length <= 1}
        type={(index === 0 && 'down' || index === dataSource.length - 1 && 'up' || undefined)}
        onClick={(type) => {   
          const stock = text
          let current = 0
          let end = index
          if (type === 'down') {
            current = index
            end = dataSource.length - 1
          }
          while (current <= end) {
            cb(field, dataSource[current], current)(stock)
            current++
          }
        }}
      >
        {node}
      </ArrowContain>
    )
  }
  public getColumns (cb: any, dataSource: SkuProps[]): ColumnProps<SkuProps>[] {
    return [
      {
        title: '供应商skuID',
        dataIndex: 'storeProductSkuId',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              value={text}
              placeholder="请输入供应商skuid"
              onChange={cb('storeProductSkuId', record, index)}
            />
          );
        },
      },
      {
        title: '商品编码',
        dataIndex: 'skuCode',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              value={text}
              placeholder="请输入商品编码"
              onChange={cb('skuCode', record, index)}
            />
          );
        },
      },
      {
        title: '发货方式',
        dataIndex: 'deliveryMode',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Select value={text} placeholder="请选择" onChange={cb('deliveryMode', record, index)}>
              {
                deliveryModeType.getArray().map(item => (<Option value={item.key} key={item.key}>{item.val}</Option>))
              }
            </Select>
          )
        }
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('marketPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入市场价"
              onChange={cb('marketPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '成本价',
        dataIndex: 'costPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('costPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入成本价"
              onChange={cb('costPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '库存',
        dataIndex: 'stock',
        width: 200,
        render: (text: any, record, index: any) => (
          this.speedyInput('stock', text, record, index, dataSource, cb)(
            <Input
              value={text}
              placeholder="请输入库存"
              onChange={cb('stock', record, index)}
            />
          )
        ),
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        width: 200,
        render: (text, record, index: any) => (
          this.speedyInput('salePrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入销售价"
              onChange={cb('salePrice', record, index)}
            />
          )
        ),
      },
      {
        title: '团长价',
        dataIndex: 'headPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('headPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入团长价"
              onChange={cb('headPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '社区管理员价',
        dataIndex: 'areaMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('areaMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入社区管理员价"
              onChange={cb('areaMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '城市合伙人价',
        dataIndex: 'cityMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('cityMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入合伙人价"
              onChange={cb('cityMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '公司管理员价',
        dataIndex: 'managerMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('managerMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入公司管理员价"
              onChange={cb('managerMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '警戒库存',
        dataIndex: 'stockAlert',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('stockAlert', text, record, index, dataSource, cb)(
            <Input
              value={text}
              placeholder="请输入警戒库存"
              onChange={cb('stockAlert', record, index)}
            />
          )
        ),
      },
    ]
  }
  /** 海外列表 */
  public getOverseasColumns (cb: any, dataSource: SkuProps[]): ColumnProps<SkuProps>[] {
    return [
      {
        title: '供应商skuID',
        dataIndex: 'storeProductSkuId',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              value={text}
              placeholder="请输入供应商skuid"
              onChange={cb('storeProductSkuId', record, index)}
            />
          );
        },
      },
      {
        title: '商品编码',
        dataIndex: 'skuCode',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Input
              value={text}
              placeholder="请输入商品编码"
              onChange={cb('skuCode', record, index)}
            />
          );
        },
      },
      {
        title: '发货方式',
        dataIndex: 'deliveryMode',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Select value={text} placeholder="请选择" onChange={cb('deliveryMode', record, index)}>
              {
                deliveryModeType.getArray().map(item => (<Option value={item.key} key={item.key}>{item.val}</Option>))
              }
            </Select>
          )
        }
      },
      {
        title: '备案信息',
        dataIndex: 'baxx',
        width: 100,
        render: (text, record) => {
          return (
            <div onClick={this.showRecordInfo.bind(this, record)}>已完成</div>
          )
        }
      },
      {
        title: '综合税率（读取自备案信息）',
        dataIndex: 'baxx11',
        width: 100
      },
      {
        title: '库存',
        dataIndex: 'stock',
        width: 200,
        render: (text: any, record, index) => {
          return (
            <Button
              size='small'
              onClick={this.showStockInfo.bind(this, record)}
            >
              查看
            </Button>
          )
        },
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('marketPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入市场价"
              onChange={cb('marketPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '成本价',
        dataIndex: 'costPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('costPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入成本价"
              onChange={cb('costPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '销售价',
        dataIndex: 'salePrice',
        width: 200,
        render: (text, record, index: any) => (
          this.speedyInput('salePrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入销售价"
              onChange={cb('salePrice', record, index)}
            />
          )
        ),
      },
      {
        title: '团长价',
        dataIndex: 'headPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('headPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入团长价"
              onChange={cb('headPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '社区管理员价',
        dataIndex: 'areaMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('areaMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入社区管理员价"
              onChange={cb('areaMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '城市合伙人价',
        dataIndex: 'cityMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('cityMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入合伙人价"
              onChange={cb('cityMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '公司管理员价',
        dataIndex: 'managerMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('managerMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              value={text}
              placeholder="请输入公司管理员价"
              onChange={cb('managerMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '警戒库存',
        dataIndex: 'stockAlert',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('stockAlert', text, record, index, dataSource, cb)(
            <Input
              value={text}
              placeholder="请输入警戒库存"
              onChange={cb('stockAlert', record, index)}
            />
          )
        ),
      },
    ]
  }
  public handleChangeValue = (text: string, record: any, index: any) => (e: any) => {
    const { dataSource } = this.state;
    dataSource[index][text] = e.target ? e.target.value : e;
    this.setState({ dataSource });
    if (this.props.onChange) {
      this.props.onChange([...dataSource])
    }
  }
  public showRecordInfo (id: any) {
    console.log(this, 'thi')
    this.props.alert && this.props.alert({
      title: 'xxx',
      content: (
        <div><Record /></div>
      )
    })
  }
  public showStockInfo (id: any) {
    console.log(this, 'thi')
    this.props.alert && this.props.alert({
      title: 'xxx',
      content: (
        <div><Stock /></div>
      )
    })
  }
  public render () {
    const columns = (this.props.extraColumns || []).concat(this.props.type !== 0 ? this.getOverseasColumns(this.handleChangeValue, this.state.dataSource) : this.getColumns(this.handleChangeValue, this.state.dataSource))
    return (
      <Table
        // rowKey={(record: any) => record.id}
        style={{ marginTop: 10 }}
        scroll={{ x: 2500, y: 600 }}
        columns={columns}
        dataSource={this.state.dataSource}
        pagination={false}
      />
    )
  }
}
export default Alert<Props>(Main)
