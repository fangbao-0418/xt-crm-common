import React from 'react'
import { Button } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig, memberOptions } from '../config'
import ReceiverWidget from './components/widget/receiver'
import MultiDateWidget from './components/widget/multi-date'
import styles from './style.module.styl'
class Main extends React.Component {
  public form: FormInstance
  public constructor (props: {}) {
    super(props)
    this.save = this.save.bind(this)
  }
  public componentDidMount () {
    this.setValue()
  }
  public setValue() {
    this.form.setValues({
      muldate: ['2019-1-28 19:24:45', '2019-2-28 19:24:45', '2019-3-28 19:24:45']
    })
  }
  public save () {
    // this.form
    console.log(this.form.getValues())
  }
  public render () {
    return (
      <div
        style={{
          background: '#FFF'
        }}
      >
        <Form
          getInstance={(ref) => {
            this.form = ref
          }}
          className={styles.form}
          style={{
            padding: '40px 20px',
            // width: 500
          }}
          config={getFieldsConfig()}
          labelCol={{
            span: 6
          }}
          wrapperCol={{
            span: 18
          }}
        >
          <FormItem
            wrapperCol={{
              span: 4
            }}
            name='type'
          />
          <FormItem
            label='标题'
            name='title'
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            name='content'
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            name='jumpUrl'
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            label='消息接收方'
          >
            <FormItem
              name='xxx'
              type='radio'
              labelCol={{
                span: 0
              }}
              options={[{
                label: '固定用户',
                value: '1'
              }]}
            />
            <FormItem
              name='member'
              type='checkbox'
              labelCol={{
                span: 0
              }}
              options={memberOptions}
            />
            <FormItem
              name='xxx'
              type='radio'
              labelCol={{
                span: 0
              }}
              options={[{
                label: '自定义',
                value: '2'
              }]}
            />
            <FormItem
              labelCol={{
                span: 0
              }}
              inner={() => {
                return (
                  <ReceiverWidget
                  />
                )
              }}
            >
            </FormItem>
          </FormItem>
          <FormItem
            label='定时发送'
            inner={(form) => {
              return form.getFieldDecorator('muldate')(
                <MultiDateWidget
                  showTime
                  // format='YYYY-MM-DD HH:mm:ss'
                  //
                />
              )
            }}
          />
          <div className='line mb10' />
          <FormItem>
            <div>
              <Button
                onClick={this.save}
                type='primary'
              >
                提交
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Main
