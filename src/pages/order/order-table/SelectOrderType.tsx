import React from 'react';
import SelectFetch from '@/packages/common/components/select-fetch';
import { getOrderTypeList } from '../api';
class SelectOrderType extends React.Component {
  fetchData = () => {
    return getOrderTypeList()
      .then((res: { name: string, value: number}[]) => (res || []).map(item => ({ label: item.name, value: item.value})))
  }
  render () {
    return (
      <SelectFetch
        placeholder='请选择订单类型'
        fetchData={this.fetchData}
      />
    )
  }
}

export default SelectOrderType;