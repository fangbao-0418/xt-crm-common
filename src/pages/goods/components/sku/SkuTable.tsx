import React from 'react'
import { Table, Card, Select, Input, Button, Form, InputNumber } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import { FormComponentProps } from 'antd/lib/form'
import { PaginationConfig } from 'antd/lib/pagination'
import { deliveryModeType } from '@/enum';
import ArrowContain from '../arrow-contain'
import { SkuSaleProps } from './index'
import Image from '@/components/Image';
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import InputMoney from '@/packages/common/components/input-money'
import Record from './Record'
import Stock from './Stock'
import Decimal from 'decimal.js'
import styles from './style.module.scss'
import ProductSeletor from '../product-selector'
import { replaceHttpUrl } from '@/util/utils'
import { getBaseSkuDetail } from '../../sku-sale/api';
const { Option } = Select;
const FormItem = Form.Item;
interface Props extends Partial<AlertComponentProps>, FormComponentProps {
  extraColumns?: ColumnProps<any>[]
  dataSource: SkuSaleProps[]
  onChange?: (dataSource: SkuSaleProps[]) => void
  /** 0-普通商品，10-一般海淘商品，20-保税仓海淘商品 */
  type: 0 | 10 | 20
  /** sku备案信息 */
  productCustomsDetailVOList: any[]
  /** 1: 入库商品，0: 非入库商品 */
  warehouseType: 1 | 0
  isGroup: boolean
}

interface State {
  dataSource: SkuSaleProps[];
  selectedRows: any[];
}

class Main extends React.Component<Props, State> {
  public pagination: PaginationConfig = {
    current: 1,
    pageSize: 10
  }
  public state: State = {
    dataSource: this.props.dataSource || [],
    selectedRows: []
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
  public speedyInput (field: string, text: any, record: SkuSaleProps, index: number, dataSource: SkuSaleProps[], cb?: any) {
    const { pageSize = 10, current = 1 } = this.pagination
    const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index
    return (node: React.ReactNode) => (
      <ArrowContain
        disabled={dataSource.length <= 1}
        type={(realIndex === 0 && 'down' || realIndex === dataSource.length - 1 && 'up' || undefined)}
        onClick={(type) => {   
          const value = text
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
        {node}
      </ArrowContain>
    )
  }
  
  public getColumns (cb: any, dataSource: SkuSaleProps[]): ColumnProps<SkuSaleProps>[] {
    const  differentColumns = this.props.warehouseType === 1 ? [{
      title: '规格条码',
      dataIndex: 'barCode',
      width: 200,
      render: (text: any, record: any, index: any) => {
        return (
          <Input
            value={text}
            placeholder="请输入规格条码"
            onChange={cb('barCode', record, index)}
          />
        );
      },
    },
    {
      title: '规格编码',
      dataIndex: 'skuCode',
      width: 200,
      render: (text: any, record: any, index: any) => {
        return (
          <Input
            value={text}
            placeholder="请输入规格编码"
            onChange={cb('skuCode', record, index)}
          />
        );
      },
    }]: [{
      title: '供应商skuid',
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
      }
    }, {
      title: '发货方式',
      dataIndex: 'deliveryMode',
      width: 200,
      render: (text: any, record: any, index: any) => {
        return (
          <Select
            disabled={this.props.warehouseType === 1}
            value={text}
            placeholder="请选择"
            onChange={cb('deliveryMode', record, index)}
          >
            {
              deliveryModeType.getArray().map(item => (<Option value={item.key} key={item.key}>{item.val}</Option>))
            }
          </Select>
        )
      }
    }]
    return [
      ...differentColumns,
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('marketPrice', text, record, index, dataSource, cb)(
            <InputMoney
              precision={2}
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
              precision={2}
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
            <InputNumber
              precision={0}
              min={0}
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
              precision={2}
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
              precision={2}
              value={text}
              placeholder="请输入团长价"
              onChange={cb('headPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '区长价',
        dataIndex: 'areaMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('areaMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              precision={2}
              value={text}
              placeholder="请输入区长价"
              onChange={cb('areaMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '合伙人价',
        dataIndex: 'cityMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('cityMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              precision={2}
              value={text}
              placeholder="请输入合伙人价"
              onChange={cb('cityMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '管理员价',
        dataIndex: 'managerMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('managerMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              precision={2}
              value={text}
              placeholder="请输入管理员价"
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
            <InputNumber
              precision={0}
              min={0}
              value={text}
              placeholder="请输入警戒库存"
              onChange={cb('stockAlert', record, index)}
            />
          )
        ),
      }
    ]
  }
  /** 海外列表 */
  public getOverseasColumns (cb: any, dataSource: SkuSaleProps[]): ColumnProps<SkuSaleProps>[] {
    const { getFieldDecorator } = this.props.form
    const differentColumns = this.props.warehouseType === 1 ? [{
      title: '规格条码',
      dataIndex: 'barCode',
      width: 200,
      render: (text: any, record: any, index: any) => {
        return (
          <Input
            value={text}
            placeholder="请输入规格条码"
            onChange={cb('barCode', record, index)}
          />
        );
      },
    }, {
      title: <div><span style={{color: 'red'}}>*</span>规格编码</div>,
      dataIndex: 'skuCode',
      width: 200,
      render: (text: string, record: any, index: number) => {
        return (
          <FormItem
            wrapperCol={{span: 24}}
          > 
            {
              getFieldDecorator(`skuCode-${index}`, {
                initialValue: text,
                rules: [
                  {
                    required: true,
                    message: '规格编码不能为空'
                  },
                  {
                    pattern: /^SH[\d]{6}[\dA-Z]{1}\d{3}$/,
                    message: '规格编码规则：固定头(1位大写字母，固定为S) + 产品类型(1位大写字母，固定H) + 创建年月日(6位数字，2019简写19) + 类目代码(1位数字或大写字母) + 流水号(3位数字), 示例: SH191126A001，SH1912042016'
                  }
                ]
              })(
                <Input
                  disabled={true}
                  placeholder="请输入规格编码"
                  onChange={(e) => {
                    const value = e.target.value
                    cb('skuCode', record, index)(value)
                    setTimeout(() => {
                      this.forceUpdate()
                      console.log('skuCode')
                    }, 400)
                  }}
                />
              )
            }
          </FormItem>
        );
      },
    }]: [{
      title: '供应商skuid',
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
      title: <div><span style={{color: 'red'}}>*</span>商品编码</div>,
      dataIndex: 'skuCode',
      width: 200,
      render: (text: string, record: any, index: number) => {
        return (
          <FormItem
            wrapperCol={{span: 24}}
          > 
            {
              getFieldDecorator(`skuCode-${index}`, {
                initialValue: text,
                rules: [
                  {
                    required: true,
                    message: '商品编码不能为空'
                  },
                  {
                    pattern: /^SH[\d]{6}[\dA-Z]{1}\d{3}$/,
                    message: '商品编码规则：固定头(1位大写字母，固定为S) + 产品类型(1位大写字母，固定H) + 创建年月日(6位数字，2019简写19) + 类目代码(1位数字或大写字母) + 流水号(3位数字), 示例: SH191126A001，SH1912042016'
                  }
                ]
              })(
                <Input
                  // value={text}
                  placeholder="请输入商品编码"
                  onChange={(e) => {
                    const value = e.target.value
                    cb('skuCode', record, index)(value)
                    setTimeout(() => {
                      this.forceUpdate()
                      console.log('skuCode skuCode')
                    }, 400)
                  }}
                />
              )
            }
          </FormItem>
        );
      },
    }, {
      title: '发货方式',
      dataIndex: 'deliveryMode',
      width: 200,
      render: (text: any, record: any, index: any) => {
        return (
          <Select
            value={text}
            placeholder="请选择"
            onChange={cb('deliveryMode', record, index)}
          >
            <Option value={4} key='d-4'>保宏保税仓</Option>
          </Select>
        )
      }
    }]
    return [
      ...differentColumns,
      {
        title: '备案信息',
        dataIndex: 'customsStatusInfo',
        width: 100,
        align: 'center',
        render: (text, record) => {
          return text ? (
            <span
              className={text === '已备案' ? 'href' : ''}
              onClick={() => {
                if (text === '已备案') {
                  this.showRecordInfo(record)
                }
              }}
            >
              {text}
            </span>
          ) : '-'
        }
      },
      {
        title: '综合税率',
        dataIndex: 'generalTaxRate',
        width: 100,
        render: (text) => {
          try {
            text = (text || '').toString()
            if(!text) return ''
            const num = text.indexOf('.')
            if(num === -1) return new Decimal(text || 0).mul(100).toString() + '%'
            text = text.substring(0, num) + text.substring(num+1, num+3) + '.' + text.substring(num+3)
            return text*1 + '%'
          } catch (e) {
            return ''
          }
        }
      },
      {
        title: '库存',
        dataIndex: 'stock',
        align: 'center',
        width: 100,
        render: (text, record, index) => {
          return record.skuId ? (
            <Button
              size='small'
              onClick={this.showStockInfo.bind(this, record)}
            >
              查看
            </Button>
          ) : '-'
        }
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('marketPrice', text, record, index, dataSource, cb)(
            <InputMoney
              precision={2}
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
              precision={2}
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
              precision={2}
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
              precision={2}
              value={text}
              placeholder="请输入团长价"
              onChange={cb('headPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '区长价',
        dataIndex: 'areaMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('areaMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              precision={2}
              value={text}
              placeholder="请输入区长价"
              onChange={cb('areaMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '合伙人价',
        dataIndex: 'cityMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('cityMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              precision={2}
              value={text}
              placeholder="请输入合伙人价"
              onChange={cb('cityMemberPrice', record, index)}
            />
          )
        ),
      },
      {
        title: '管理员价',
        dataIndex: 'managerMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) => (
          this.speedyInput('managerMemberPrice', text, record, index, dataSource, cb)(
            <InputMoney
              precision={2}
              value={text}
              placeholder="请输入管理员价"
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
            <InputNumber
              precision={0}
              min={0}
              value={text}
              placeholder="请输入警戒库存"
              onChange={cb('stockAlert', record, index)}
            />
          )
        ),
      },
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
  public showRecordInfo (record: SkuSaleProps) {
    const productCustomsDetailVOList = this.props.productCustomsDetailVOList || []
    const detail = productCustomsDetailVOList.find((item) => {
      return item.skuId === record.skuId
    })
    this.props.alert && this.props.alert({
      title: '备案信息',
      content: (
        <div><Record detail={detail} /></div>
      )
    })
  }
  public showStockInfo (record: SkuSaleProps) {
    this.props.alert && this.props.alert({
      title: '库存详情',
      content: (
        <Stock id={record.skuId}/>
      )
    })
  }
  public render () {
    const { selectedRows } = this.state;
    const columns = (this.props.extraColumns || []).concat(this.props.type === 20 ? this.getOverseasColumns(this.handleChangeValue, this.state.dataSource) : this.getColumns(this.handleChangeValue, this.state.dataSource))
    return (
      <>
        <Table
          rowKey={(_, idx) => idx + ''}
          className={styles['sku-table']}
          style={{ marginTop: 10 }}
          scroll={{ x: true }}
          columns={columns}
          dataSource={this.state.dataSource}
          onExpand={(expanded, record) => {
            // 展开时
            if (expanded && !record.flag && record.skuId) {
              record.flag = true;
              record.loading = true;
              this.forceUpdate();

              // 销售商品SKU中库存商品详情
              getBaseSkuDetail(record.skuId).then(data => {
                record.productBasics = data;
                record.loading = false;
                this.forceUpdate();
              })
            }
          }}
          expandedRowRender={this.props.warehouseType === 0 ? undefined : (record, index) => {
            return (
                <Table
                  loading={record.loading}
                  rowKey={(_, idx) => idx + ''}
                  dataSource={record.productBasics}
                  footer={() => (
                    <ProductSeletor
                      selectedRows={selectedRows}
                      onOk={(productBasics, hide) => {
                        const { dataSource } = this.state;
                        dataSource[index].productBasics = productBasics;
                        this.setState({ selectedRows })
                        if (this.props.onChange) {
                          this.props.onChange(dataSource);
                          hide();
                        }
                      }}
                    />
                  )}
                  columns={[{
                    title: '商品ID',
                    dataIndex: 'id'
                  }, {
                    title: '商品名称',
                    dataIndex: 'productName'
                  }, {
                    title: '商品主图',
                    dataIndex: 'productMainImage',
                    render: (url: string) => (
                      <Image
                        style={{
                          height: 100,
                          width: 100,
                          minWidth: 100
                        }}
                        src={replaceHttpUrl(url)}
                        alt='主图'
                      />
                    )
                  }, {
                    title: '商品规格',
                    dataIndex: 'propertyValue'
                  }, {
                    title: '规格条码',
                    dataIndex: 'productBasicSkuBarCode'
                  }, {
                    title: '规格编码',
                    dataIndex: 'productBasicSkuCode'
                  }, {
                    title: '市场价',
                    dataIndex: 'marketPrice'
                  }, {
                    title: '成本价',
                    dataIndex: 'costPrice'
                  }, {
                    title: '总库存',
                    dataIndex: 'totalStock'
                  }, {
                    title: '数量配置',
                    dataIndex: 'num',
                    render: (text, _, idx) => {
                      return (
                        <InputNumber
                          style={{ width: 172 }}
                          value={text}
                          placeholder='请输入数量配置'
                          precision={0}
                          onChange={(value) => {
                            const { dataSource } = this.state;
                            dataSource[index].productBasics[idx].num = value;
                            this.setState({
                              dataSource
                            })
                          }}/>
                      )
                    }
                  }, {
                    title: '操作',
                    align: 'center',
                    render: ($0, $1, idx) => (
                      <Button
                        type='link'
                        onClick={() => {
                          const { dataSource, selectedRows} = this.state;
                          record.productBasics.splice(idx, 1);
                          selectedRows.splice(idx, 1);
                          dataSource[index].productBasics = record.productBasics;
                          this.setState({ dataSource, selectedRows })
                        }}
                      >
                        删除
                      </Button>
                    )
                  }]}
                />
              // </Card>
            )
          }}
          onChange={(pagination) => {
            this.pagination = pagination
          }}
        />
      </>
    )
  }
}
export default Alert(Main)
