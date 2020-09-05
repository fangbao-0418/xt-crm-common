import React from 'react'
import { Card, Table, Empty, Form, InputNumber } from 'antd'
import WrapCard from './wrapCard'
import SkuItem from './skuItem'
import { formatMoneyWithSign } from '@/util/helper'
// import form from '@/packages/common/components/form'

const ConfirmStatusEnum = {
  0: '未导入价格',
  1: '商家已确认',
  2: '待商家确认'
} 

/** 商品规格的key */
const SpecKeysCards = ({ specKeys }) => {
  return <div>
    {
      specKeys.map(sitem => (
        <Card type="inner" key={sitem.id} title={sitem.name}>
          {
            sitem.content.length ?
              sitem.content.map((citem, i) => (
                <SkuItem key={i} cont={citem} />
              )) :
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </Card>
      ))
    }
  </div>
}

/** 商品Sku组合 */
const SpecValsCard = ({ form, status, goodsInfo }) => {
  const { specVals, specKeys } = goodsInfo;

  // 动态表头
  const dynaColums = specKeys.map(sitem => ({
    title: sitem.name,
    dataIndex: sitem.specNameKey,
    key: sitem.specNameKey
  }));

  // 固定表头
  const fixedColumns = [{
    title: '规格ID',
    dataIndex: 'productSkuId'
  }, {
    title: '条形码',
    dataIndex: 'barCode'
  }, {
    title: '供货价',
    dataIndex: 'costPrice',
    render: (value) => (value ? formatMoneyWithSign(value) : '-')
  }, {
    title: '市场价',
    dataIndex: 'marketPrice',
    render: (value) => (value ? formatMoneyWithSign(value) : '-')
  }, {
    title: '销售价',
    dataIndex: 'salePrice',
    key: 'salePrice',
    render: (value) => {
      return (value ? formatMoneyWithSign(value) : '-')
    }
  }, {
    title: '佣金上浮',
    dataIndex: 'commissionIncreaseRate',
    render: (value, record, index) => {
      if (status !== 1) {
        return (value ? formatMoneyWithSign(value) : '-')
      }
      return (
        <Form.Item>
          {
            form.getFieldDecorator(`commissionIncreaseRate[${index}]`, {
              initialValue: value
            })(
              <InputNumber
                min={0}
                max={100}
                precision={2}
              />
            )
          }
        </Form.Item>
      )
    }
  }, {
    title: '上浮后销售价',
    dataIndex: 'increaseSalePrice',
    render: (value) => (value ? formatMoneyWithSign(value) : '-')
  }, {
    title: '建议供货价',
    dataIndex: 'adviseCostPrice',
    render: (value) => (value ? formatMoneyWithSign(value) : '-')
  }, {
    title: '建议销售价',
    dataIndex: 'adviseSalePrice',
    render: (value) => (value ? formatMoneyWithSign(value) : '-')
  }, {
    title: '总库存',
    dataIndex: 'stock'
  }, {
    title: '可用库存',
    dataIndex: 'usableStock'
  }, {
    title: '商家确认状态',
    dataIndex: 'confirmStatus',
    render: (text) => {
      return ConfirmStatusEnum[text]
    }
  }]

  const startColumns = fixedColumns.slice(0, 2);
  const endColumns = fixedColumns.slice(2);
  const columns = [...startColumns, ...dynaColums, ...endColumns];

  return <div>
    <Table pagination={false} dataSource={specVals} columns={columns} />
  </div>
}

class SkuCard extends React.Component {

  render() {
    const { data, form, status } = this.props
    return (
      <Form>
        <WrapCard
          data={data}
          render={(goodsInfo) => {
            return (
              <Card title="商品规格">
                <SpecKeysCards specKeys={goodsInfo.specKeys} />
                <SpecValsCard status={status} form={form} goodsInfo={goodsInfo} />
              </Card>
            )
          }}
        />
      </Form>
    )
  }
}
// export default SkuCard
export default Form.create()(SkuCard)