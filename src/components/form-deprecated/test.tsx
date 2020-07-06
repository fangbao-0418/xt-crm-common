import React from 'react'
import { Button, Radio } from 'antd'
import Form, { FormInstance, FormItem, getFieldsConfig } from './index'
class Main extends React.Component {
  public form: FormInstance
  public state = {
    json: ''
  }
  public componentDidMount () {
    this.form.props.form.setFieldsValue({
      supplierAccount: 'abc',
      contacts: 'abced',
      sex: 'woman',
      education: '2'
    })
  }
  public render () {
    return (
      <div>
        <Form
          style={{
            width: 400,
            margin: '0 auto'
          }}
          layout='horizontal'
          config={
            getFieldsConfig({
              profile: {
                supplierAccount: {
                  formItemProps: {
                    wrapperCol: {span: 10}
                  }
                },
                contacts: {
                  controlProps: {
                    type: 'password'
                  }
                }
              }
            })
          }
          getInstance={(ref: any) => {
            this.form = ref
          }}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          namespace='profile'
        >
          <FormItem
            name='supplierAccount'
            type='text'
            addonAfter={(
              <div>sssss</div>
            )}
          />
          <FormItem name='contacts' />
          <FormItem name='name' />
          <FormItem name='phone' />
          <FormItem
            label='学历'
            name='education'
            type='select'
            options={[
              {label: '本科', value: '1'},
              {label: '专科', value: '2'}
            ]}
          >
          </FormItem>
          <FormItem
            label='出生日期'
            name='birth'
            type='date'
          >
          </FormItem>
          <FormItem
            label='性别'
            name='sex'
            type='radio'
            optionFieldexchange={{label: 'name', value: 'code'}}
            options={[
              {name: '男', code: 'man'},
              {name: '女', code: 'woman'}
            ]}
          >
          </FormItem>
          <FormItem
            label='兴趣爱好'
            type='checkbox'
            name='interest'
            options={[
              {label: '篮球', value: 'basketball'},
              {label: '足球', value: 'football'}
            ]}
          >
          </FormItem>
          <div>
            {this.state.json}
          </div>
          <Button
            onClick={() => {
              console.log(this.form.getValues())
              this.setState({
                json: JSON.stringify(this.form.getValues())
              })
            }}
          >
            提交
          </Button>
        </Form>
      </div>
    )
  }
}
export default Main
