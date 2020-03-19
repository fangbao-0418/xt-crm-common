import React from 'react';
import { Card, Table, Empty } from 'antd';
import WrapCard from './wrapCard'
import SkuItem from './skuItem'

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
    title: '销售价',
    dataIndex: 'salePrice',
    key: 'salePrice'
  }, {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock'
  }]

  const columns = [...dynaColums, ...fixedColumns];

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