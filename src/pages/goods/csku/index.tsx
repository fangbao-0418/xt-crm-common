import React from 'react';
import { ListPage } from '@/packages/common/components';
class List extends React.Component {
  columns = [{
    title: '商品ID'
  }, {
    title: '商品名称'
  }, {
    title: '商品编码'
  }, {
    title: '商品条码'
  }, {
    title: '总库存'
  }, {
    title: '锁定库存'
  }, {
    title: '供应商'
  }, {
    title: '状态'
  }, {
    title: '创建时间'
  }, {
    title: '最后操作时间'
  }, {
    title: '操作人'
  }, {
    title: '操作'
  }]
  render() {
    return (
      <ListPage
        api={() => Promise.resolve({ records: []})}
        columns={this.columns}
      />
    )
  }
}

export default List;