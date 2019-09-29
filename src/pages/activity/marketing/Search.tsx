import React from 'react'
import { Row, Col, Button } from 'antd'
import Form, { FormItem, FormInstance } from '@/components/form'
interface Props {
  //
}
class Main extends React.Component<Props> {
  public form: FormInstance
  public componentDidMount () {

  }
  public render () {
    return (
      <div
        style={{
          background: '#FFFFFF',
          padding: '10px 20px'
        }}
      >
        <Form
          layout='inline'
          namespace='marketing'
          getInstance={(ref) => {
            this.form = ref
          }}
        >
          <FormItem
            name='startTime'
          >
          </FormItem>
          <FormItem
            name='name'
          >
          </FormItem>
          <FormItem
            name='status'
          >
          </FormItem>
          <FormItem
            name='activeNo'
          >
          </FormItem>
          <FormItem
            name='createTime'
          >
          </FormItem>
          <FormItem>
            <Button
              type='primary'
              className='mr10'
              onClick={() => {
                console.log(this.form.getValues())
              }}
            >
              查询
            </Button>
            <Button>重置</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Main
