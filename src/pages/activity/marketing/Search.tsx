import React from 'react'
import { Row, Col, Button } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
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
      console.log(values, 'values--------------')
      values.createStartTime = values.createStartTime && values.createStartTime * 1000
      values.createEndTime = values.createEndTime && values.createEndTime * 1000
      values.startTime = values.startTime && values.startTime * 1000
      values.endTime = values.endTime && values.endTime * 1000
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
          rangeMap={{
            createTime: {
              fields: ['createStartTime', 'createEndTime']
            },
            startTime: {
              fields: ['startTime', 'endTime']
            }
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
            name='discountsStatus'
          >
          </FormItem>
          <FormItem
            name='id'
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
