import React from 'react';
import { Card, Table, Empty } from 'antd';
import WrapCard from './wrapCard'
import SkuItem from './skuItem'
import { formatMoneyWithSign } from '@/util/helper';

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
const SpecValsCard = ({ goodsInfo }) => {
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
    title: '销售价',
    dataIndex: 'salePrice',
    key: 'salePrice',
    render: (value) => (value ? formatMoneyWithSign(value) : '-')
  }, {
    title: '总库存',
    dataIndex: 'stock',
    key: 'stock'
  }, {
    title: '可用库存',
    dataIndex: 'usableStock',
    key: 'usableStock'
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
    const { data } = this.props
    return (
      <WrapCard
        data={data}
        render={(goodsInfo) => {
          return (
            <Card title="商品规格">
              <SpecKeysCards specKeys={goodsInfo.specKeys} />
              <SpecValsCard goodsInfo={goodsInfo} />
            </Card>
          )
        }}
      />
    )
  }
}

export default SkuCard