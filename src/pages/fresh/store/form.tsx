import React from 'react';
import { Form, FormItem } from '@/packages/common/components';
import { Card } from 'antd';
class StoreForm extends React.Component {
  render() {
    return (
      <Form>
        <Card title='门店基础信息'>
          <FormItem />
        </Card>
      </Form>
    )
  }
}

export default StoreForm;