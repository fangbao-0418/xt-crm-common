import React, { forwardRef } from 'react'
import { Select } from 'antd'
import { dissoc } from '@/util/utils'
import { unionBy } from 'lodash'
function SupplierSelect(props, ref) {
  const { expressList } = APP.constant
  console.log('expressList =>', expressList);
  const textType = props.textType
  const propsWithoutTextType = dissoc(props, 'textType')

  return (
    <Select
      placeholder='请选择快递公司'
      style={{ width: 150 }}
      {...propsWithoutTextType}
      ref={ref}
    >
      {unionBy(expressList, 'value').map((item, index) => (
        <Select.Option value={textType ? item.label : item.value} key={index}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  )
}

export default forwardRef(SupplierSelect)
