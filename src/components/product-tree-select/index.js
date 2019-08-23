import React, { forwardRef } from 'react';
import { TreeSelect } from 'antd';
const { SHOW_PARENT } = TreeSelect;
function ProductTreeSelect({ treeData, value, onChange }, ref) {
  const transformTreeData = (treeData) => {
    if (!Array.isArray(treeData)) return []
    return treeData.map(v => {
      return {
        children: transformTreeData(v.childList),
        title: v.name,
        key: v.id,
        value: v.id
      }
    })
  }
  const tProps = {
    treeData: transformTreeData(treeData),
    value,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    searchPlaceholder: '请选择',
    style: {
      width: 300,
    },
  };
  return <TreeSelect {...tProps} ref={ref}/>
}
export default forwardRef(ProductTreeSelect);