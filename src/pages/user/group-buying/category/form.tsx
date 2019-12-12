import React from 'react'
import { Card, Radio } from 'antd'
import Form, { FormItem} from '@/packages/common/components/form'
import ActivitySelector from './components/ActivitySelector'
class Main extends React.Component {
  public render () {
    return (
      <Card title='编辑分类'>
        <Form>
          <FormItem
            name='name'
            label='团购会分类名称'
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                required: true
              }]
            }}
            controlProps={{
              style: {
                width: 172
              }
            }}
          />
          <FormItem
            name='sort'
            label='排序'
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                required: true
              }]
            }}
            controlProps={{
              style: {
                width: 172
              }
            }}
          />
          <FormItem
            name='display'
            type='radio'
            label='是否显示'
            options={[{
              label: 'A',
              value: 1
            }, {
              label: 'B',
              value: 2
            }]}
          />
          <FormItem
            label='关联商品'
            verifiable
            name='relatedProduct'
            type='checkbox'
            addonAfter={<ActivitySelector />}
            options={[{
              label: '关联类目',
              value: 1
            }, {
              label: '关联活动',
              value: 2
            }]}
            fieldDecoratorOptions={{
              rules: [{
                required: true,
                message: '请选择关联活动'
              }]
            }}
          />
          <FormItem />
        </Form>
      </Card>
    )
  }
}

export default Main