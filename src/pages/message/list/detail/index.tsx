import React from 'react'
import { Button } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import { getFieldsConfig, memberOptions } from '../config'
import ReceiverWidget from './components/widget/receiver'
import MultiDateWidget from './components/widget/multi-date'
import * as api from '../api'
import styles from './style.module.styl'

interface Props extends RouteComponentProps<{id: string}> {}
interface State {
  readonly: boolean
}
class Main extends React.Component<Props, any> {
  public form: FormInstance
  public id = this.props.match.params.id
  public state = {
    readonly: this.id === '-1' ? false : true
  }
  public constructor (props: Props) {
    super(props)
    this.save = this.save.bind(this)
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    if (this.id === '-1') {
      // this.setValue({
      //   regularTime: ['']
      // })
    } else {
      api.fetchDetail(this.id).then((res) => {
        this.setValue({
          messageTitle: res.messageTitle,
          messageContent: res.messageContent,
          // messageType: res.messageType,
          messageType: '10',
          jumpUrl: res.jumpUrl
        })
      })
    }
  }
  public setValue(values: any) {
    this.form.setValues(values)
    // this.form.setValues({
    //   regularTime: ['2019-1-28 19:24:45', '2019-2-28 19:24:45', '2019-3-28 19:24:45']
    // })
  }
  public save () {
    // this.form
    console.log(this.form.getValues())
    const values = this.form.getValues()
    api.saveMessage(values).then((res) => {
      //
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
          readonly={this.state.readonly}
          // disabled
        >
          <FormItem
            wrapperCol={{
              span: 4
            }}
            name='messageType'
          />
          <FormItem
            label='标题'
            name='messageTitle'
            wrapperCol={{
              span: 8
            }}
          />
          <FormItem
            name='messageContent'
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
              inner={(form) => {
                return form.getFieldDecorator('regularTime')(
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
              return form.getFieldDecorator('regularTime')(
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
export default withRouter(Main)
