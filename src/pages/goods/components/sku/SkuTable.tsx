import React from 'react';
import { Table, Select, Input, Button, Form, InputNumber } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { FormComponentProps } from 'antd/lib/form';
import { PaginationConfig } from 'antd/lib/pagination';
import { deliveryModeType } from '@/enum';
import ArrowContain from '../arrow-contain';
import { SkuSaleProps } from './index';
import Image from '@/components/Image';
import Alert, { AlertComponentProps } from '@/packages/common/components/alert';
import InputMoney from '@/packages/common/components/input-money';
import Record from './Record';
import Stock from './Stock';
import Decimal from 'decimal.js';
import styles from './style.module.scss';
import ProductSeletor from '../product-selector';
import { replaceHttpUrl } from '@/util/utils';
import { getBaseSkuDetail } from '../../sku-sale/api';
import classNames from 'classnames';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { pick } from 'lodash';
const { Option } = Select;
const FormItem = Form.Item;
interface Props extends Partial<AlertComponentProps>, FormComponentProps {
  extraColumns?: ColumnProps<any>[];
  dataSource: SkuSaleProps[];
  onChange?: (dataSource: SkuSaleProps[]) => void;
  /** 0-普通商品，10-一般海淘商品，20-保税仓海淘商品 */
  type: 0 | 10 | 20;
  /** sku备案信息 */
  productCustomsDetailVOList: any[];
  isGroup: boolean;
}

// 通过返回数据拿到id到规格详情的映射关系
function getSelectedRowKeysMap(data: any[]) {
  let result: any = {};
  for (let item of data) {
    if (result[item.id]) {
      result[item.id] = result[item.id].concat([item.productBasicSkuId]);
    } else {
      result[item.id] = [item.productBasicSkuId];
    }
  }
  return result;
}

function combination(data: any[]) {
  data = data || [];
  const keysMap: any = {};
  const result: any[] = [];
  for (let item of data) {
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
      productBasicSkuInfos: [
        pick(item, [
          'productBasicSkuId',
          'productBasicSkuCode',
          'productBasicSkuBarCode',
          'productBasicSpuCode',
          'propertyValue',
          'marketPrice',
          'costPrice',
          'totalStock'
        ])
      ]
    };
    if (keysMap[item.id]) {
      keysMap[item.id].productBasicSkuInfos = [...keysMap[item.id].productBasicSkuInfos, record];
    } else {
      keysMap[item.id] = record;
      result.push(record);
    }
  }
  console.log('result =>', result);
  return result;
}

interface State {
  dataSource: SkuSaleProps[];
  selectedRowKeys: any[];
  selectedRowKeysMap: any;
}

class Main extends React.Component<Props, State> {
  public pagination: PaginationConfig = {
    current: 1,
    pageSize: 10
  };
  public state: State = {
    dataSource: this.props.dataSource || [],
    selectedRowKeys: [],
    selectedRowKeysMap: []
  };
  public componentWillReceiveProps(props: Props) {
    this.setState({
      dataSource: props.dataSource
    });
  }
  public speedyInputCallBack = (dataSource: SkuSaleProps[]) => {
    if (this.props.onChange) {
      this.props.onChange([...dataSource]);
    }
  };
  // 快速填充
  public speedyInput(
    field: string,
    text: any,
    record: SkuSaleProps,
    index: number,
    dataSource: SkuSaleProps[],
    cb?: any,
    fieldDecoratorOptions?: GetFieldDecoratorOptions
  ) {
    const { pageSize = 10, current = 1 } = this.pagination;
    const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index;
    return (node: React.ReactNode) => {
      return (
        <FormItem wrapperCol={{ span: 24 }}>
          <ArrowContain
            disabled={dataSource.length <= 1}
            type={(realIndex === 0 && 'down') || (realIndex === dataSource.length - 1 && 'up') || undefined}
            onClick={type => {
              // const value = text
              let currentIndex = 0;
              let end = realIndex;
              if (type === 'down') {
                currentIndex = realIndex;
                end = dataSource.length - 1;
              }
              let fields: any = [];
              while (currentIndex <= end) {
                fields.push(`${field}-${currentIndex}`);
                dataSource[currentIndex][field] = text as never;
                currentIndex++;
              }
              this.props.form.resetFields(fields);
              this.speedyInputCallBack(dataSource);
            }}
          >
            {fieldDecoratorOptions
              ? this.props.form &&
                this.props.form.getFieldDecorator(`${field}-${realIndex}`, {
                  initialValue: text,
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
    };
  }

  public getColumns(cb: any, dataSource: SkuSaleProps[]): ColumnProps<SkuSaleProps>[] {
    const validateColumnsFields = (index: number) => {
      const { pageSize = 10, current = 1 } = this.pagination;
      const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index;
      this.props.form &&
        this.props.form.validateFields(
          ['salePrice', 'headPrice', 'areaMemberPrice', 'cityMemberPrice', 'managerMemberPrice'].map(
            key => `${key}-${realIndex}`
          )
        );
    };
    const differentColumns = [
            {
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
              }
            },
            {
              title: '规格条码',
              dataIndex: 'barCode',
              width: 200,
              render: (text: any, record: any, index: any) => {
                return <Input value={text} placeholder="请输入规格条码" onChange={cb('barCode', record, index)} />;
              }
            },
            {
              title: '规格编码',
              dataIndex: 'skuCode',
              width: 200,
              render: (text: any, record: any, index: any) => {
                return <Input value={text} placeholder="请输入商品编码" onChange={cb('skuCode', record, index)} />;
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
                    placeholder="请选择"
                    onChange={cb('deliveryMode', record, index)}
                  >
                    {deliveryModeType.getArray().map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.val}
                      </Option>
                    ))}
                  </Select>
                );
              }
            }
          ];
    return [
      ...differentColumns,
      {
        title: '单位',
        dataIndex: 'unit',
        width: 200,
        render: (text, record, index) => {
          return this.speedyInput(
            'unit',
            text,
            record,
            index,
            dataSource,
            cb
          )(<Input maxLength={10} value={text} placeholder="请输入单位" onChange={cb('unit', record, index)} />);
        }
      },
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
          })(<InputMoney min={0.01} precision={2} placeholder="请输入市场价" />);
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
              placeholder="请输入成本价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '库存',
        dataIndex: 'stock',
        width: 100,
      },
      {
        title: '可用库存',
        dataIndex: 'usableStock',
        width: 100,
      },
      {
        title: '加减可用库存',
        dataIndex: 'incStock',
        width: 100,
        render: (text: any, record, index: any) =>
          this.speedyInput(
            'incStock',
            text,
            record,
            index,
            dataSource,
            cb
          )(
            <InputNumber
              precision={0}
              value={text || 0}
              placeholder="请输入库存"
              onChange={cb('incStock', record, index)}
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
                    cb('请输入销售价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 销售价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.headPrice && value <= record.headPrice) {
                    cb({
                      message: '应高于团长价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 销售价(${value}元) ${value === record.headPrice ? '等于' : '低于'} 团长价(${
                        record.headPrice
                      }元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入销售价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '团长价',
        dataIndex: 'headPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('headPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb('请输入团长价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 团长价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.salePrice && value >= record.salePrice) {
                    cb({
                      message: '应低于销售价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 团长价(${value}元) ${value === record.salePrice ? '等于' : '高于'} 销售价(${
                        record.salePrice
                      }元)`
                    });
                  } else if (record.areaMemberPrice && value <= record.areaMemberPrice) {
                    cb({
                      message: '应高于社区管理员价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 团长价(${value}元) ${value === record.areaMemberPrice ? '等于' : '低于'} 社区管理员价(${
                        record.areaMemberPrice
                      }元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入团长价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '区长价',
        dataIndex: 'areaMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('areaMemberPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb('请输入区长价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 社区管理员价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.headPrice && value >= record.headPrice) {
                    cb({
                      message: '应低于团长价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 社区管理员价(${value}元) ${value === record.headPrice ? '等于' : '高于'} 团长价(${
                        record.headPrice
                      }元)`
                    });
                  } else if (record.cityMemberPrice && value <= record.cityMemberPrice) {
                    cb({
                      message: '应高于城市合伙人价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 社区管理员价(${value}元) ${
                        value === record.cityMemberPrice ? '等于' : '低于'
                      } 城市合伙人价(${record.cityMemberPrice}元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入区长价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '合伙人价',
        dataIndex: 'cityMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('cityMemberPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb('请输入合伙人价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 城市合伙人价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.areaMemberPrice && value >= record.areaMemberPrice) {
                    cb({
                      message: '应低于社区管理员价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 城市合伙人价(${value}元) ${
                        value === record.areaMemberPrice ? '等于' : '高于'
                      } 社区管理员价(${record.areaMemberPrice}元)`
                    });
                  } else if (record.managerMemberPrice && value <= record.managerMemberPrice) {
                    cb({
                      message: '应高于公司管理员价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 城市合伙人价(${value}元) ${
                        value === record.managerMemberPrice ? '等于' : '低于'
                      } 公司管理员价(${record.managerMemberPrice}元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入合伙人价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '管理员价',
        dataIndex: 'managerMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('managerMemberPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb('请输入管理员价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 公司管理员价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.cityMemberPrice && value >= record.cityMemberPrice) {
                    cb({
                      message: '应低于合伙人价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 公司管理员价(${value}元) ${value === record.cityMemberPrice ? '等于' : '高于'} 合伙人价(${
                        record.cityMemberPrice
                      }元)`
                    });
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 公司管理员价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入管理员价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '警戒库存',
        dataIndex: 'stockAlert',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput(
            'stockAlert',
            text,
            record,
            index,
            dataSource,
            cb
          )(
            <InputNumber
              precision={0}
              min={0}
              value={text}
              placeholder="请输入警戒库存"
              onChange={cb('stockAlert', record, index)}
            />
          )
      }
    ];
  }
  /** 海外列表 */
  public getOverseasColumns(cb: any, dataSource: SkuSaleProps[]): ColumnProps<SkuSaleProps>[] {
    const validateColumnsFields = (index: number) => {
      const { pageSize = 10, current = 1 } = this.pagination;
      const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index;
      this.props.form &&
        this.props.form.validateFields(
          ['salePrice', 'headPrice', 'areaMemberPrice', 'cityMemberPrice', 'managerMemberPrice'].map(
            key => `${key}-${realIndex}`
          )
        );
    };
    const differentColumns = [
      {
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
        }
      },
      {
        title: (
          <div>
            <span style={{ color: 'red' }}>*</span>商品编码
          </div>
        ),
        dataIndex: 'skuCode',
        width: 200,
        render: (text: string, record: any, index: number) => {
          const { pageSize = 10, current = 1 } = this.pagination;
          const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index;

          return (
            <FormItem wrapperCol={{ span: 24 }}>
              {this.props.form &&
                this.props.form.getFieldDecorator(`skuCode-${realIndex}`, {
                  initialValue: text,
                  rules: [
                    {
                      required: true,
                      message: '商品编码不能为空'
                    },
                    {
                      pattern: /^SH[\d]{6}[\dA-Z]{1}\d{3}$/,
                      message:
                        '商品编码规则：固定头(1位大写字母，固定为S) + 产品类型(1位大写字母，固定H) + 创建年月日(6位数字，2019简写19) + 类目代码(1位数字或大写字母) + 流水号(3位数字), 示例: SH191126A001，SH1912042016'
                    }
                  ]
                })(
                  <Input
                    // value={text}
                    placeholder="请输入商品编码"
                    onChange={e => {
                      const value = e.target.value;
                      cb('skuCode', record, index)(value);
                      setTimeout(() => {
                        this.forceUpdate();
                        console.log('skuCode skuCode');
                      }, 400);
                    }}
                  />
                )}
            </FormItem>
          );
        }
      },
      {
        title: '发货方式',
        dataIndex: 'deliveryMode',
        width: 200,
        render: (text: any, record: any, index: any) => {
          return (
            <Select value={text} placeholder="请选择" onChange={cb('deliveryMode', record, index)}>
              <Option value={4} key="d-4">
                保宏保税仓
              </Option>
            </Select>
          );
        }
      }
    ];

    return [
      ...differentColumns,
      {
        title: (
          <div style={{ textAlign: 'center' }}>
            <div>单次限购</div>
            <span style={{ fontSize: 12 }}>(0为不限制)</span>
          </div>
        ),
        width: 200,
        dataIndex: 'singleBuyNumMax',
        render: (text: any, record: any, index: any) => {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {this.speedyInput(
                'singleBuyNumMax',
                text,
                record,
                index,
                dataSource,
                cb
              )(
                <InputNumber
                  min={0}
                  maxLength={8}
                  precision={0}
                  value={text}
                  onChange={cb('singleBuyNumMax', record, index)}
                />
              )}
              <span style={{ marginLeft: 4, marginBottom: 24 }}>件</span>
            </div>
          );
        }
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 200,
        render: (text, record, index) => {
          return this.speedyInput(
            'unit',
            text,
            record,
            index,
            dataSource,
            cb
          )(<Input maxLength={10} value={text} placeholder="请输入单位" onChange={cb('unit', record, index)} />);
        }
      },
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
                  this.showRecordInfo(record);
                }
              }}
            >
              {text}
            </span>
          ) : (
            '-'
          );
        }
      },
      {
        title: '综合税率',
        dataIndex: 'generalTaxRate',
        width: 100,
        render: text => {
          try {
            text = (text || '').toString();
            if (!text) return '';
            const num = text.indexOf('.');
            if (num === -1) return new Decimal(text || 0).mul(100).toString() + '%';
            text = text.substring(0, num) + text.substring(num + 1, num + 3) + '.' + text.substring(num + 3);
            return text * 1 + '%';
          } catch (e) {
            return '';
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
            <Button size="small" onClick={this.showStockInfo.bind(this, record)}>
              查看
            </Button>
          ) : (
            '-'
          );
        }
      },
      {
        title: '可用库存',
        dataIndex: 'usableStock',
        width: 100,
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('marketPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                required: true,
                message: '请输入市场价'
              }
            ]
          })(<InputMoney min={0.01} precision={2} placeholder="请输入市场价" />)
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
              placeholder="请输入成本价"
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
                    cb('请输入销售价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 销售价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.headPrice && value <= record.headPrice) {
                    cb({
                      message: '应高于团长价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 销售价(${value}元) ${value === record.headPrice ? '等于' : '低于'} 团长价(${
                        record.headPrice
                      }元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入销售价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '团长价',
        dataIndex: 'headPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('headPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb('请输入团长价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 团长价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.salePrice && value >= record.salePrice) {
                    cb({
                      message: '应低于销售价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 团长价(${value}元) ${value === record.salePrice ? '等于' : '高于'} 销售价(${
                        record.salePrice
                      }元)`
                    });
                  } else if (record.areaMemberPrice && value <= record.areaMemberPrice) {
                    cb({
                      message: '应高于社区管理员价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 团长价(${value}元) ${value === record.areaMemberPrice ? '等于' : '低于'} 社区管理员价(${
                        record.areaMemberPrice
                      }元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入团长价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '区长价',
        dataIndex: 'areaMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('areaMemberPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb('请输入区长价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 社区管理员价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.headPrice && value >= record.headPrice) {
                    cb({
                      message: '应低于团长价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 社区管理员价(${value}元) ${value === record.headPrice ? '等于' : '高于'} 团长价(${
                        record.headPrice
                      }元)`
                    });
                  } else if (record.cityMemberPrice && value <= record.cityMemberPrice) {
                    cb({
                      message: '应高于城市合伙人价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 社区管理员价(${value}元) ${
                        value === record.cityMemberPrice ? '等于' : '低于'
                      } 城市合伙人价(${record.cityMemberPrice}元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入区长价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '合伙人价',
        dataIndex: 'cityMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('cityMemberPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb('请输入合伙人价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 城市合伙人价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.areaMemberPrice && value >= record.areaMemberPrice) {
                    cb({
                      message: '应低于社区管理员价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 城市合伙人价(${value}元) ${
                        value === record.areaMemberPrice ? '等于' : '高于'
                      } 社区管理员价(${record.areaMemberPrice}元)`
                    });
                  } else if (record.managerMemberPrice && value <= record.managerMemberPrice) {
                    cb({
                      message: '应高于公司管理员价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 城市合伙人价(${value}元) ${
                        value === record.managerMemberPrice ? '等于' : '低于'
                      } 公司管理员价(${record.managerMemberPrice}元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入合伙人价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '管理员价',
        dataIndex: 'managerMemberPrice',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput('managerMemberPrice', text, record, index, dataSource, cb, {
            rules: [
              {
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb('请输入管理员价');
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 公司管理员价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  } else if (record.cityMemberPrice && value >= record.cityMemberPrice) {
                    cb({
                      message: '应低于合伙人价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 公司管理员价(${value}元) ${value === record.cityMemberPrice ? '等于' : '高于'} 合伙人价(${
                        record.cityMemberPrice
                      }元)`
                    });
                  } else if (record.costPrice && value <= record.costPrice) {
                    cb({
                      message: '应高于成本价',
                      pass: true,
                      msg: `规格名称: ${record.propertyValue1 || ''} ${record.propertyValue2 ||
                        ''} 公司管理员价(${value}元) ${value === record.costPrice ? '等于' : '低于'} 成本价(${
                        record.costPrice
                      }元)`
                    });
                  }
                  cb();
                }
              }
            ]
          })(
            <InputMoney
              min={0.01}
              precision={2}
              placeholder="请输入管理员价"
              onBlur={() => validateColumnsFields(index)}
            />
          )
      },
      {
        title: '警戒库存',
        dataIndex: 'stockAlert',
        width: 200,
        render: (text: any, record: any, index: any) =>
          this.speedyInput(
            'stockAlert',
            text,
            record,
            index,
            dataSource,
            cb
          )(
            <InputNumber
              precision={0}
              min={0}
              value={text}
              placeholder="请输入警戒库存"
              onChange={cb('stockAlert', record, index)}
            />
          )
      }
    ];
  }
  public handleChangeValue = (field: string, record: any, index: any) => (e: any) => {
    console.log(index, '---------')
    const { pageSize = 10, current = 1 } = this.pagination
    const realIndex = current > 1 ? pageSize * (current - 1) + index : index
    const value = (e && e.target ? e.target.value : e) as never;
    console.log(value);
    const dataSource = this.props.dataSource;
    dataSource[realIndex][field] = value;
    if (this.props.onChange) {
      this.props.onChange([...dataSource]);
    }
  };
  public showRecordInfo(record: SkuSaleProps) {
    const productCustomsDetailVOList = this.props.productCustomsDetailVOList || [];
    const detail = productCustomsDetailVOList.find(item => {
      return item.skuId === record.skuId;
    });
    this.props.alert &&
      this.props.alert({
        title: '备案信息',
        content: (
          <div>
            <Record detail={detail} />
          </div>
        )
      });
  }
  public showStockInfo(record: SkuSaleProps) {
    this.props.alert &&
      this.props.alert({
        title: '库存详情',
        content: <Stock id={record.skuId} />
      });
  }
  public render() {
    const { selectedRowKeys, selectedRowKeysMap } = this.state;
    const isBondedGood = this.props.type === 20// 是否保税仓海淘商品
    const columns = (this.props.extraColumns || []).concat(
      isBondedGood
        ? this.getOverseasColumns(this.handleChangeValue, this.state.dataSource)
        : this.getColumns(this.handleChangeValue, this.state.dataSource)
    );
    console.log(this.state.dataSource, 'this.state.dataSource')
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
              getBaseSkuDetail(record.skuId)
                .then(data => {
                  record.productBasics = data;
                  record.loading = false;

                  this.setState({
                    selectedRowKeys: data.map((v: any) => v.id),
                    selectedRowKeysMap: getSelectedRowKeysMap(data)
                  });
                  this.forceUpdate();
                })
                .catch(() => {
                  record.loading = false;
                  this.forceUpdate();
                });
            }
          }}
          expandIcon={ isBondedGood ? undefined : (props: any) => {
            const { expanded, record, onExpand } = props;
            const {deliveryMode} = record
            console.log(deliveryMode, 'deliveryMode');
            return deliveryMode === 1 ? (
              <div
                className={classNames({
                  'ant-table-row-expand-icon': true,
                  'ant-table-row-expanded': expanded,
                  'ant-table-row-collapsed': !expanded
                })}
                onClick={event => {
                  onExpand(record, event);
                }}
              ></div>
            ) : null;
          }}
          expandedRowRender={ isBondedGood ? undefined : (record, index) => {
              const {deliveryMode} = record
              return (
                deliveryMode === 1 && <Table
                  loading={record.loading}
                  rowKey={(_, idx) => `sku-table-${index}`}
                  dataSource={record.productBasics}
                  footer={() => (
                    <ProductSeletor
                      selectedRowKeys={selectedRowKeys}
                      selectedRowKeysMap={selectedRowKeysMap}
                      productBasics={combination(record.productBasics)}
                      onOk={({ selectedRowKeys, productBasics, selectedRowKeysMap }: any) => {
                        const { dataSource } = this.state;
                        dataSource[index].productBasics = [...productBasics];
                        this.setState({
                          selectedRowKeys,
                          dataSource,
                          selectedRowKeysMap
                        });
                        if (this.props.onChange) {
                          this.props.onChange(dataSource);
                        }
                      }}
                    />
                  )}
                  columns={[
                    {
                      title: '商品ID',
                      dataIndex: 'id'
                    },
                    {
                      title: '商品名称',
                      dataIndex: 'productName'
                    },
                    {
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
                          alt="主图"
                        />
                      )
                    },
                    {
                      title: '商品规格',
                      dataIndex: 'propertyValue'
                    },
                    {
                      title: '规格条码',
                      dataIndex: 'productBasicSkuBarCode'
                    },
                    {
                      title: '规格编码',
                      dataIndex: 'productBasicSkuCode'
                    },
                    {
                      title: '市场价',
                      dataIndex: 'marketPrice'
                    },
                    {
                      title: '成本价',
                      dataIndex: 'costPrice'
                    },
                    {
                      title: '总库存',
                      dataIndex: 'totalStock'
                    },
                    {
                      title: '数量配置',
                      dataIndex: 'num',
                      render: (text, _, idx) => {
                        return (
                          <InputNumber
                            style={{ width: 172 }}
                            value={text}
                            max={999}
                            placeholder="请输入数量配置"
                            precision={0}
                            onChange={value => {
                              const { dataSource } = this.state;
                              dataSource[index].productBasics[idx].num = value;
                              this.setState({
                                dataSource
                              });
                            }}
                          />
                        );
                      }
                    },
                    {
                      title: '操作',
                      align: 'center',
                      render: (record, $1, idx) => (
                        <Button
                          type="link"
                          onClick={() => {
                            const { dataSource } = this.state;
                            let selectedRowKeys: any[] = [...this.state.selectedRowKeys];
                            (dataSource[index].productBasics || []).splice(idx, 1);
                            let productBasicSkuInfoKeys: any[] = this.state.selectedRowKeysMap[record.id];
                            productBasicSkuInfoKeys = productBasicSkuInfoKeys.filter(
                              key => key !== record.productBasicSkuId
                            );
                            selectedRowKeysMap[record.id] = productBasicSkuInfoKeys;
                            if (productBasicSkuInfoKeys.length === 0) {
                              selectedRowKeys = selectedRowKeys.filter(id => id !== record.id);
                            }
                            this.setState({ dataSource, selectedRowKeys, selectedRowKeysMap });
                          }}
                        >
                          删除
                        </Button>
                      )
                    }
                  ]}
                />
              );
            }
          }
          onChange={pagination => {
            this.pagination = pagination;
          }}
        />
      </>
    );
  }
}
export default Alert(Main);
