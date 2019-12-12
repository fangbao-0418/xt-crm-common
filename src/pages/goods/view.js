import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import { setQuery, parseQuery } from '@/util/utils';
import List from './list';
const { TabPane } = Tabs;

const goods = props => {
  const initialStatus = parseQuery().status || '0'
  console.log(parseQuery().status, '------------------------')
  const [status, setStatus] = useState(initialStatus);
  const callback = (status) => {
    setStatus(status);
    setQuery({
      page: 1,
      pageSize: 10,
      status
    }, true);
  };
  return (
    <>
      <Card>
        <Tabs defaultActiveKey={initialStatus} onChange={callback}>
          <TabPane tab="出售中" key="0" />
          <TabPane tab="仓库中" key="1" />
          <TabPane tab="待上架" key="3" />
          <TabPane tab="商品池" key="2" />
        </Tabs>
        <List key={status} status={status} />
      </Card>
    </>
  );
};

export default goods;
