import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import List from './list';
const { TabPane } = Tabs;

const goods = props => {
  const [listActive, setListActive] = useState('0');
  const callback = e => {
    setListActive(e);
  };

  return (
    <>
      <Card>
        <Tabs defaultActiveKey="0" onChange={callback}>
          <TabPane tab="出售中" key="0" />
          <TabPane tab="仓库中" key="1" />
        </Tabs>
        <List key={listActive} status={listActive} />
      </Card>
    </>
  );
};

export default goods;
