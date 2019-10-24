import React, { forwardRef } from 'react';
import { Select } from 'antd';
import { dissoc } from '@/util/utils';
import { ExpressCompanyOptions } from '@/config';

const { Option } = Select;
const valueArray = Object.keys(ExpressCompanyOptions);

function SupplierSelect(props, ref) {
  const textType = props.textType;
  const propsWithoutTextType = dissoc(props, 'textType');
  return (
    <Select placeholder="请选择快递公司" style={{ width: 150 }} {...propsWithoutTextType} ref={ref}>
      {valueArray.map((v, index) => (
        <Option value={textType ? ExpressCompanyOptions[v] : v} key={index}>
          {ExpressCompanyOptions[v]}
        </Option>
      ))}
    </Select>
  );
}

export default forwardRef(SupplierSelect);
