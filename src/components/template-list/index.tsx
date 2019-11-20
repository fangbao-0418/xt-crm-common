import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { templateList } from './api';
function TemplateList(props: any, ref: any) {
  const [list, setList] = useState([]);
  const getTemplateList = async () => {
    const res = await templateList();
    setList(res);
  };
  useEffect(() => {
    getTemplateList();
  }, []);
  return (
    <Select placeholder="请选择" style={{ width: 200 }} {...props} ref={ref}>
      {(list || []).map((v: any) => (
        <Select.Option key={v.freightTemplateId} value={v.freightTemplateId}>
          {v.templateName}
        </Select.Option>
      ))}
    </Select>
  );
}
export default React.forwardRef(TemplateList);
