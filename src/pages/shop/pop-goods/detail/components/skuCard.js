import React from 'react'
import { Card, Table, Empty, Form, InputNumber } from 'antd'
import WrapCard from './wrapCard'
import SkuItem from './skuItem'
import { formatMoneyWithSign } from '@/util/helper'
import { namespace } from '../model'
import { parseQuery } from '@/util/utils'
import ArrowContain from './arrow-contain'
import Decimaljs from 'decimal.js'

const MAX_PRICE_NUMBER = 9999999.99

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

  // 快速填充
function speedyInput(
    form,
    field,
    text,
    record,
    index,
    dataSource,
    cb,
    agencyRate
  ) {
    // const { pageSize = 10, current = 1 } = this.pagination;
    // const realIndex = dataSource.length <= pageSize ? index : pageSize * (current - 1) + index;
    const realIndex = index
    return (node) => {
      return (
        <Form.Item wrapperCol={{ span: 24 }}>
          <ArrowContain
            disabled={dataSource.length <= 1}
            type={(realIndex === 0 && 'down') || (realIndex === dataSource.length - 1 && 'up') || undefined}
            onClick={type => {
              let currentIndex = 0;
              let end = realIndex;
              if (type === 'down') {
                currentIndex = realIndex;
                end = dataSource.length - 1;
              }
              let fields = [];
              const values = {}
              while (currentIndex <= end) {
                let key = `${field}-${currentIndex}`
                fields.push(key);
                const record = dataSource[currentIndex]
                // const min = -Decimaljs(record.salePrice).mul(agencyRate).div(1000).floor().mul(10).toNumber()
                // const max = record.salePrice
                // const currentText = text > max ? max : ((text < min) ? min : text)
                let currentText = text
                if (field === 'companyCommission') {
                  const min = -record.costPrice + 1
                  currentText = text < min ? min : text
                }
                dataSource[currentIndex][field] = currentText
                currentIndex++
                values[key] = text
              }
              form.resetFields(fields)
              cb(dataSource)
            }}
          >
            {form.getFieldDecorator(`${field}-${realIndex}`, {
              initialValue: APP.fn.formatMoneyNumber(text, 'm2u')
            })(node)}
          </ArrowContain>
        </Form.Item>
      );
    };
}

/** 商品Sku组合 */
const SpecValsCard = ({ form, status, goodsInfo, data, confirmStatus }) => {
  const query = parseQuery()
  const readonly = !!query.readonly
  const { specVals, specKeys } = data;
  const { auditStatus  } = goodsInfo
  const handleChangeValue = (dataSource) => {
    goodsInfo.skuList = dataSource
    APP.dispatch[namespace].saveDefault({ goodsInfo: {...goodsInfo} });
  };
  // 动态表头
  const dynaColums = specKeys.map(sitem => ({
    title: sitem.name,
    dataIndex: sitem.specNameKey,
    key: sitem.specNameKey
  }));
  const productCategoryVO = goodsInfo.productCategoryVO || {}
  const { agencyRate } = productCategoryVO
  // 固定表头
  const fixedColumns = [{
    title: '规格序号',
    dataIndex: 'skuId',
    width: 90
  }, {
    title: '规格ID',
    width: 150,
    dataIndex: 'productSkuId'
  }, {
    title: '条形码',
    width: 150,
    dataIndex: 'barCode'
  }, {
    title: '供货价',
    dataIndex: 'costPrice',
    width: 150,
    render: (value) => (formatMoneyWithSign(value))
  }, {
    title: '市场价',
    dataIndex: 'marketPrice',
    width: 150,
    render: (value) => (formatMoneyWithSign(value))
  }, {
    title: '销售价',
    dataIndex: 'salePrice',
    key: 'salePrice',
    width: 150,
    render: (value) => {
      return (formatMoneyWithSign(value))
    }
  }, {
    title: '代理佣金',
    hidden: !(status === 1 && confirmStatus === 1),
    dataIndex: 'agencyCommission',
    width: 200,
    render: (text, record, index) => {
      if (readonly || (status !== 1 || confirmStatus !== 1)) {
        return (formatMoneyWithSign(text))
      }
      return speedyInput(
        form,
        `agencyCommission`,
        text,
        record,
        index,
        specVals,
        handleChangeValue,
        agencyRate
      )(
        <InputNumber
          // value={value}
          style={{ width: '100%' }}
          onChange={(e) => {
            e = e > MAX_PRICE_NUMBER ? MAX_PRICE_NUMBER : e
            e = e < 0 ? 0 : e
            const current = APP.fn.formatMoneyNumber(e)
            const skuList = goodsInfo.skuList
            skuList[index] = {
              ...skuList[index],
              agencyCommission: current
            }
            APP.dispatch[namespace].saveDefault({ goodsInfo: {...goodsInfo} });
          }}
          min={0.01}
          max={MAX_PRICE_NUMBER}
          precision={2}
        />
      )
    }
  }, {
    title: '公司利润',
    hidden: !(status === 1 && confirmStatus === 1),
    dataIndex: 'companyCommission',
    width: 200,
    render: (text, record, index) => {
      if (readonly || (status !== 1 || confirmStatus !== 1)) {
        return (formatMoneyWithSign(text))
      }
      const min = -APP.fn.formatMoneyNumber(record.costPrice - 1, 'm2u')
      return speedyInput(
        form,
        `companyCommission`,
        text,
        record,
        index,
        specVals,
        handleChangeValue,
        agencyRate
      )(
        <InputNumber
          // value={value}
          style={{ width: '100%' }}
          onChange={(e) => {
            e = e > MAX_PRICE_NUMBER ? MAX_PRICE_NUMBER : e
            e = e < min ? min : e
            const current = APP.fn.formatMoneyNumber(e)
            const skuList = goodsInfo.skuList
            skuList[index] = {
              ...skuList[index],
              companyCommission: current
            }
            console.log(current, 'current')
            APP.dispatch[namespace].saveDefault({ goodsInfo: {...goodsInfo} });
          }}
          min={min}
          max={MAX_PRICE_NUMBER}
          precision={2}
        />
      )
    }
  }, {
    title: '调整后销售价',
    hidden: !(status === 1 && confirmStatus === 1),
    dataIndex: 'finalSalePrice',
    width: 150,
    render: (value, record) => {
      return formatMoneyWithSign((record.costPrice ?? 0) + (record.agencyCommission ?? 0) + (record.companyCommission ?? 0))
    },
  }, {
    title: '建议供货价',
    dataIndex: 'adviseCostPrice',
    hidden: !(auditStatus === 2 && confirmStatus !== 0),
    width: 150,
    render: (value) => (formatMoneyWithSign(value))
  }, {
    title: '建议销售价',
    dataIndex: 'adviseSalePrice',
    hidden: !(auditStatus === 2 && confirmStatus !== 0),
    width: 150,
    render: (value) => (formatMoneyWithSign(value))
  }, {
    title: '总库存',
    dataIndex: 'stock',
    width: 150
  }, {
    title: '可用库存',
    dataIndex: 'usableStock',
    width: 150
  }].filter((item) => !item.hidden)

  const startColumns = fixedColumns.slice(0, 2);
  const endColumns = fixedColumns.slice(2);
  const columns = [...startColumns, ...dynaColums, ...endColumns].concat(confirmStatus !== 0 ? [{
    title: '商家确认状态',
    dataIndex: 'confirmStatus',
    width: 150,
    render: (text) => {
      return ConfirmStatusEnum[confirmStatus]
    }
  }] : []);

  // console.log(columns, 'coumns coumnscoumnscoumns')
  // console.log(columns.reduce((a, b) => {
  //   console.log((typeof a === 'number') ? a : a?.width, b, 'xxxx')
  //   return ((typeof a === 'number') ? a : (a?.width || 0)) + (b.width || 0)
  // }), 'xxxxxxx')
  return (
    <div>
      <Table
        pagination={false}
        dataSource={specVals}
        columns={columns}
        scroll={{
          x: columns.reduce((a, b) => {
            // console.log(a, b.width, 'xxxxxx')
            return ((typeof a === 'number') ? a : (a?.width || 100)) + (b.width || 100)
          })
        }}
      />
    </div>
  )
}

class SkuCard extends React.Component {

  render() {
    const { data, form, goodsInfo } = this.props
    const { confirmStatus, status } = goodsInfo || {}
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