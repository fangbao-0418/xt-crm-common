import React from 'react';
import { Form, FormItem } from '@/packages/common/components';
import { Tabs } from 'antd';
import { NAME_SPACE, defaultConfig } from './config';
const { TabPane } = Tabs;
class WithdrawForm extends React.Component {
  render() {
    return (
      <Tabs defaultActiveKey='1'>
        <TabPane tab='提现详情' key='1'>
          <Form config={defaultConfig} namespace={NAME_SPACE}>
            <FormItem name='transferNo'/>
            <FormItem name='moneyAccountTypeDesc'/>
          </Form>
        </TabPane>
        <TabPane tab='信息记录' key='2'>

        </TabPane>
      </Tabs>
    )
  }
}

export default WithdrawForm;