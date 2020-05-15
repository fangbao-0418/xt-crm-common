import React from 'react'
import { Form, FormItem, SelectFetch } from '@/packages/common/components'
import { Card, Button } from 'antd'
import { NAME_SPACE, defaultConfigForm } from './config'
import { FormInstance } from '@/packages/common/components/form'
import If from '@/packages/common/components/if'
import { addUpdateInstructor, getShopDetail } from './api'
import { RouteComponentProps } from 'react-router'
import { parseQuery } from '@/util/utils'
import { RecordProps } from './interface'

type Props = RouteComponentProps<{id: string}>;

interface FormState {
  record: Partial<RecordProps>
  readonly: boolean
}
class AreaForm extends React.Component<Props, FormState> {
  readonly: boolean = !!(parseQuery() as any).readOnly
  state: FormState = {
    record: {},
    readonly: this.readonly
  }
  form: FormInstance;
  id: string = '-1'
  constructor (props: Props) {
    super(props)
    this.id = props.match.params.id
  }
  componentDidMount () {
    this.id !== '-1' && this.fetchData()
  }
  fetchData () {
    getShopDetail(this.id).then(res => {
      this.setState({
        record: res || {},
        readonly: this.readonly || res.status === 5
      })
      this.form.setValues(res)
    })
  }
  handleSave = () => {
    this.form.props.form.validateFields((err, vals) => {
      if (!err) {
        const isAdd = this.id === '-1'
        if (!isAdd) {
          vals.id=this.id
        }
        const promiseResult = addUpdateInstructor(vals)
        promiseResult.then((res: any) => {
          if (res) {
            APP.history.push('/fresh/instructor')
          }
        })
      }
    })
  }
  render () {
    const { readonly } = this.state
    return (
      <Form
        readonly={readonly}
        getInstance={ref => this.form = ref}
        namespace={NAME_SPACE}
        config={defaultConfigForm}
        addonAfter={(
          <div style={{ width: '60%' }}>
            <FormItem>
              <If condition={!readonly}>
                <Button type='primary' onClick={this.handleSave} className='mr10'>保存</Button>
              </If>
              <Button
                type='primary'
                onClick={() => {
                  APP.history.push('/fresh/instructor')
                }}>
                  返回
              </Button>
            </FormItem>
          </div>
        )}
      >
        <Card title='基本信息'>
          <div style={{ width: '60%' }}>
            <FormItem name='id' type='text' hidden={this.id === '-1'} />
            <FormItem
              verifiable
              name='instructorName'
            />
            <FormItem
              verifiable
              disabled={this.id !== '-1'}
              name='instructorPhone'
            />
            <FormItem
              required={false}
              verifiable
              name='instructorRemark'
            />
            <FormItem
              required={false}
              verifiable
              name='selfPointAreaIds'
            />
            <FormItem
              required={false}
              verifiable
              name='selfPointIds'
            />
          </div>
        </Card>
      </Form>
    )
  }
}

export default AreaForm