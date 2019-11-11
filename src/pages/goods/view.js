import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import { setQuery } from '@/util/utils';
import List from './list';
const { TabPane } = Tabs;

const goods = props => {
  const [listActive, setListActive] = useState("1");
  const callback = val => {
    setQuery({ page: 1, pageSize: 10}, true);
    setListActive(val);
  };

  return (
    <>
      <Card>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="出售中" key="1" />
          <TabPane tab="商品池" key="2" />
          <TabPane tab="仓库中" key="0" />
        </Tabs>
        <List key={listActive} status={listActive} />
      </Card>
    </>
  );
};

export default goods;
