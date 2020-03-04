import React from 'react';
import SelectFetch from '@/packages/common/components/select-fetch';
import { getOrderTypeList } from '../api';
interface SelectOrderTypeProps {
  value: any;
  onChange: (value: any) => void;
}
class SelectOrderType extends React.Component<SelectOrderTypeProps, any> {
  fetchData = () => {
    return getOrderTypeList()
      .then((res: { name: string, value: number}[]) => (res || []).map(item => ({ label: item.name, value: item.value})))
  }
  render () {
    const { value, onChange } = this.props;
    return (
      <SelectFetch
        value={value}
        onChange={onChange}
        placeholder='请选择订单类型'
        fetchData={this.fetchData}
      />
    )
  }
}

export default SelectOrderType;