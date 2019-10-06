import React from 'react'
import { Row, Col, Button } from 'antd'
import Form, { FormItem, FormInstance } from '@/components/form'
interface Props {
  onSearch?: (value: any) => void
}
class Main extends React.Component<Props> {
  public form: FormInstance
  public componentDidMount () {

  }
  public onSearch () {
    if (this.props.onSearch) {
      const values = this.form.getValues()
      this.props.onSearch(values)
    }
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
                this.onSearch()
              }}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                this.form.props.form.resetFields()
                this.onSearch()
              }}
            >
              重置
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Main
