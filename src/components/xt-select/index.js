import React from 'react';
import {Select} from 'antd';
function XtSelect({data, ...props}) {
    return (
        <Select placeholder="请选择" {...props}>
            {data.map(v => <Select.Option key={v.key} value={v.key}>{v.val}</Select.Option>)}
        </Select>
    )
}
export default XtSelect;