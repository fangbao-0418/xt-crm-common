import React from 'react'
import { Card, Table, Empty, Form, InputNumber } from 'antd'
import WrapCard from './wrapCard'
import SkuItem from './skuItem'
import { formatMoneyWithSign } from '@/util/helper'
import { namespace } from '../model'

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
const SpecValsCard = ({ form, status, goodsInfo, data, confirmStatus }) => {
  const { specVals, specKeys } = data;

  // 动态表头
  const dynaColums = specKeys.map(sitem => ({
    title: sitem.name,
    dataIndex: sitem.specNameKey,
    key: sitem.specNameKey
  }));

  // 固定表头
  const fixedColumns = [{
    title: '规格序号',
    dataIndex: 'skuId',
    width: 90
  }, {
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
    hidden: !(status === 1 && confirmStatus === 1),
    // hidden: true,
    dataIndex: 'commissionIncreasePrice',
    render: (value, record, index) => {
      if (status !== 1 || confirmStatus !== 1) {
        return (value ? formatMoneyWithSign(value) : '-')
      }
      value = APP.fn.formatMoneyNumber(value, 'm2u')
      return (
        <Form.Item>
          {
            form.getFieldDecorator(`commissionIncreasePrice[${index}]`, {
              initialValue: value
            })(
              <InputNumber
                value={value}
                onChange={(e) => {
                  const max = APP.fn.formatMoneyNumber(record.salePrice, 'm2u')
                  const current = APP.fn.formatMoneyNumber(e > max ? max : e)
                  const skuList = goodsInfo.skuList
                  skuList[index] = {
                    ...skuList[index],
                    commissionIncreasePrice: current,
                    increaseSalePrice: current + record.salePrice
                  }
                  APP.dispatch[namespace].saveDefault({ goodsInfo });
                }}
                min={0}
                max={APP.fn.formatMoneyNumber(record.salePrice, 'm2u')}
                precision={1}
              />
            )
          }
        </Form.Item>
      )
    }
  }, {
    title: '上浮后销售价',
    hidden: !(status === 1 && confirmStatus === 1),
    dataIndex: 'increaseSalePrice',
    render: (value, record) => {
      return APP.fn.formatMoneyNumber((record.salePrice + record.commissionIncreasePrice), 'm2u')
    },
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
  }].filter((item) => !item.hidden)
  console.log(fixedColumns, (status === 1 && confirmStatus === 1), '(status === 1 && confirmStatus === 2(status === 1 && confirmStatus === 2(status === 1 && confirmStatus === 2')
  const startColumns = fixedColumns.slice(0, 2);
  const endColumns = fixedColumns.slice(2);
  const columns = [...startColumns, ...dynaColums, ...endColumns].concat(confirmStatus !== 0 ? [{
    title: '商家确认状态',
    dataIndex: 'confirmStatus',
    render: (text) => {
      return ConfirmStatusEnum[confirmStatus]
    }
  }] : []);

  return <div>
    <Table pagination={false} dataSource={specVals} columns={columns} />
  </div>
}

class SkuCard extends React.Component {

  render() {
    const { data, form, status, confirmStatus, goodsInfo } = this.props
    return (
      <Form>
        <WrapCard
          data={data}
          render={(value) => {
            return (
              <Card title="商品规格">
                <SpecKeysCards specKeys={value.specKeys} />
                <SpecValsCard
                  data={value}
                  confirmStatus={confirmStatus}
                  status={status}
                  form={form}
                  goodsInfo={goodsInfo}
                />
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