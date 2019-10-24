import React from 'react'
import { Button } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from './config'
class Main extends React.Component {
  public form: FormInstance
  public payload: any = {
    //
  }
  public fetchData () {

  }
  public reset () {

  }
  public render () {
    return (
      <div>
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
                  this.payload = {
                    ...this.payload,
                    ...value,
                    page: 1
                  }
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
      </div>
    )
  }
}
export default Main
