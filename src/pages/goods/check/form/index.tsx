import React from 'react'
import { getFieldsConfig } from './config';
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { Button, Card } from 'antd';

interface State {

}

class Main extends React.Component<any, State>{
  public form: FormInstance
  public payload: GoodsCheck.payloadProps
  public reset () {
    this.form.props.form.resetFields()
    this.payload = {
      pageSize: 10,
      status: 0,
      page: 1
    }
    // this.fetchData()
  }
  public render() {
    return (
      <Card title="筛选">
        <Form
        layout='inline'
        config={getFieldsConfig()}
        getInstance={(ref) => {
          this.form = ref
        }}
        addonAfter={(
          <div
            style={{
              display: 'inline-block',
              lineHeight: '40px',
              verticalAlign: 'top'
            }}
          >
            <Button
              type='primary'
              className='mr10'
              onClick={() => {
                const value = this.form.getValues()
                if (value.status === undefined) {
                  value.enableStatus = 0
                } else {
                  value.enableStatus = 1
                }
                // this.payload = {
                //   ...this.payload,
                //   ...value,
                //   page: 1
                // }
                // this.fetchData()
              }}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                this.reset()
              }}
            >
              清除
            </Button>
          </div>
        )}
      >
      </Form>
    </Card>
    )
  }
}
export default Main;