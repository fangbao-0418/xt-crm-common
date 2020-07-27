import React from 'react'
import { Card, Button } from 'antd'
import Form, {
  FormInstance,
  FormItem
} from '@/packages/common/components/form'
import * as api from './api'
import RelationCheckbox, { Option } from '@/components/relation-checkbox'

interface State {
  oneLevels: Option[]
  twoLevels: Option[]
  loading: boolean
}

class Main extends React.Component<any, State> {
  public form: FormInstance
  public state: State = {
    oneLevels: [],
    twoLevels: [],
    loading: true
  }
  componentDidMount () {
    this.setState({
      loading: true
    })
    api.fetchCategory({ level: 2 }).then(res => {
      this.setState({
        loading: false,
        oneLevels: [
          {
            label: '全部',
            value: -1,
            children: res.map((item: any) => ({
              label: item.name,
              value: item.id
            }))
          }
        ],
        twoLevels: res.map((item: any) => ({
          label: item.name,
          value: item.id,
          children: item.children.map((item: any) => ({
            label: item.name,
            value: item.id,
          }))
        }))
      })
    }, () => {
      this.setState({
        loading: false
      })
    })
  }
  public handleSave = () => {
    this.form.props.form.validateFields((err, value) => {
      if (err) {
        return
      }
      console.log(value, 123)
    })
  }
  render () {
    const { loading, oneLevels, twoLevels } = this.state
    if (loading) {
      return (
        <div>
          请选择需要配置类目排行榜的类目
          <Card loading title='一级类目'></Card>
          <Card loading title='二级类目'></Card>
        </div>
      )
    }
    return (
      <div>
        请选择需要配置类目排行榜的类目
        <Form
          getInstance={(ref) => {
            this.form = ref
          }}
          labelCol={{
            span: 0
          }}
          wrapperCol={{
            span: 24
          }}
        >
          <Card title='一级类目'>
            <FormItem
              inner={(form) => {
                return form.getFieldDecorator('oneLevels', {
                  rules: [
                    {
                      validator: (_, value, callback) => {
                        if (value && value.length) {
                          callback()
                          return
                        }
                        callback('请至少选择一项')
                      }
                    }
                  ]
                })(
                  <RelationCheckbox
                    divider={false}
                    twoLabelShow={false}
                    options={oneLevels}
                  />
                )
              }}
            />
          </Card>
          <Card title='二级类目'>
            <FormItem
              inner={(form) => {
                return form.getFieldDecorator('twoLevels', {
                  rules: [
                    {
                      validator: (_, value, callback) => {
                        if (value && value.length) {
                          callback()
                          return
                        }
                        callback('请至少选择一项')
                      }
                    }
                  ]
                })(
                  <RelationCheckbox
                    lableSpan={4}
                    valueSpan={20}
                    divider={false}
                    options={twoLevels}
                  />
                )
              }}
            />
          </Card>
          <Card
            style={{ background: 'none' }}
            bodyStyle={{ padding: '0 24px' }}
            bordered={false}
          >
            <FormItem
              labelCol={{
                span: 0
              }}
              wrapperCol={{
                offset: 0
              }}
            >
              <Button
                type='primary'
                onClick={this.handleSave}
              >
                保存
              </Button>
            </FormItem>
          </Card>
        </Form>
      </div>
    )
  }
}

export default Main
