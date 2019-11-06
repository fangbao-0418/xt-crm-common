import React from 'react'
import { Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig, memberOptions } from '../config'
import * as api from '../api'
import styles from './style.module.styl'
interface Props extends RouteComponentProps<{id: string}> {}
class Main extends React.Component<Props> {
  public form: FormInstance
  public id = this.props.match.params.id
  public constructor (props: Props) {
    super(props)
    this.save = this.save.bind(this)
  }
  public componentDidMount () {
    // this.setValue()
    this.fetchData()
  }
  public fetchData () {
    if (this.id !== '-1') {
      api.getDetail(this.id).then((res) => {
        this.setValue(res)
      })
    }
  }
  public setValue(values: any) {
    console.log(values, 'setValue')
    this.form.setValues({
      ...values,
      muldate: ['2019-1-28 19:24:45', '2019-2-28 19:24:45', '2019-3-28 19:24:45']
    })
  }
  public save () {
    this.form.props.form.validateFields((err, value) => {
      if (err) {
        return
      }
      if (this.id !== '-1') {
        api.updateTempate({
          ...value,
          id: this.id
        }).then(() => {
          APP.success('修改模板成功')
          APP.history.push('/message/template')
        })
      } else {
        api.addTemplate(value).then(() => {
          APP.success('添加模板成功')
          APP.history.push('/message/template')
        })
      }
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
            name='businessGroup'
            verifiable
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            name='messageGroup'
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
export default withRouter(Main)
