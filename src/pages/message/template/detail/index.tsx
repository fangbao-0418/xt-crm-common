import React from 'react'
import { Button } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig, memberOptions } from '../config'
import styles from './style.module.styl'
interface Props {}
class Main extends React.Component<Props> {
  public form: FormInstance
  public constructor (props: Props) {
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
    this.form.props.form.validateFields((err, value) => {
      console.log(this.form.getValues())
    })
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
            verifiable
          />
          <FormItem
            name='templateTitle'
            verifiable
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            name='messageGroup'
            verifiable
            wrapperCol={{
              span: 4
            }}
          />
          <FormItem
            label='模板名称'
            name='businessGroup'
            verifiable
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            name='templateContent'
            verifiable
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
          <div className='line mb10' />
          <FormItem>
            <div>
              <Button
                onClick={this.save}
                type='primary'
              >
                提交
              </Button>
              <Button
                className='ml10'
                onClick={() => {
                  APP.history.push('/message/template')
                }}
              >
                返回
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default Main
