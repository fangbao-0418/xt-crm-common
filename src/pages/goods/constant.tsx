import React from 'react';
import { Select, Input } from 'antd';
import { deliveryModeType } from '@/enum';
import ArrowContain from './components/arrow-contain'
import { SkuProps } from './SkuList'
const { Option } = Select;

function speedyInput (field: string, text: any, record: SkuProps, index: number, dataSource: SkuProps[], cb: any) {
  return (node: React.ReactNode) => (
    <ArrowContain
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
export const getColumns = (cb: any, dataSource: SkuProps[]) => [
  {
    title: '供应商skuID',
    dataIndex: 'storeProductSkuId',
    width: 300,
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
    width: 100,
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
    width: 100,
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
    width: 100,
    render: (text: any, record: any, index: any) => (
      speedyInput('marketPrice', text, record, index, dataSource, cb)(
        <Input
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
    width: 100,
    render: (text: any, record: any, index: any) => (
      speedyInput('costPrice', text, record, index, dataSource, cb)(
        <Input
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
    width: 100,
    render: (text: any, record: any, index: any) => (
      speedyInput('stock', text, record, index, dataSource, cb)(
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
    width: 100,
    render: (text: any, record: any, index: any) => (
      speedyInput('salePrice', text, record, index, dataSource, cb)(
        <Input
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
    width: 100,
    render: (text: any, record: any, index: any) => (
      speedyInput('headPrice', text, record, index, dataSource, cb)(
        <Input
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
    width: 150,
    render: (text: any, record: any, index: any) => (
      speedyInput('areaMemberPrice', text, record, index, dataSource, cb)(
        <Input
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
    width: 150,
    render: (text: any, record: any, index: any) => (
      speedyInput('cityMemberPrice', text, record, index, dataSource, cb)(
        <Input
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
    width: 150,
    render: (text: any, record: any, index: any) => (
      speedyInput('managerMemberPrice', text, record, index, dataSource, cb)(
        <Input
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
    width: 100,
    render: (text: any, record: any, index: any) => (
      speedyInput('stockAlert', text, record, index, dataSource, cb)(
        <Input
          value={text}
          placeholder="请输入警戒库存"
          onChange={cb('stockAlert', record, index)}
        />
      )
    ),
  },
];
