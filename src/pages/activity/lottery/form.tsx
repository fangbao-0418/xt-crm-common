import React from 'react'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { Card } from 'antd'

class Main extends React.Component {
  public form: FormInstance
  public constructor (props: any) {
    super(props)
  }
  public render () {
    return (
      <Form>
        <Card title='场次信息'>
          <FormItem name='No' type='text' label='活动序号' />
        </Card>
        <Card title='奖品列表'></Card>
      </Form>
    )
  }
}

export default Main