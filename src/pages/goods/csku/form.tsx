import React from 'react';
import Form, { FormItem, FormInstance } from '@/packages/common/components/form';
import { Card, Input } from 'antd';
class CSkuForm extends React.Component {
  form: FormInstance;
  render() {
    return (
      <Form getInstance={ref => this.form = ref}>
        <Card title='基本信息'>
          <FormItem
            label='销售商品ID'
            inner={(form) => {
              return form.getFieldDecorator('sku')(
                <Input placeholder='请输入销售商品ID'/>
              )
            }}
          />
        </Card>
      </Form>
    )
  }
}

export default CSkuForm;