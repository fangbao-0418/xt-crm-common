import React from 'react'
import { Card, Button, Empty } from 'antd'
import Form, {
  FormInstance,
  FormItem
} from '@/packages/common/components/form'
import * as api from './api'
import RelationCheckbox, { Option } from '@/components/relation-checkbox'

interface State {
  oneSubject: Option[]
  twoSubject: Option[]
  loading: boolean
}

class Main extends React.Component<any, State> {
  public form: FormInstance
  public state: State = {
    oneSubject: [],
    twoSubject: [],
    loading: true
  }
  componentDidMount () {
    this.fetchData(() => {
      this.setData()
    })
  }
  public fetchData = (cb: () => void) => {
    this.setState({
      loading: true
    })
    api.fetchCategory({ level: 2 }).then(res => {
      this.setState({
        loading: false,
        oneSubject: [
          {
            label: '全部',
            value: -1,
            children: (res || []).map((item: any) => ({
              label: item.name,
              value: item.id
            }))
          }
        ],
        twoSubject: (res || []).filter((item: any) => item.children?.length).map((item: any) => ({
          label: item.name,
          value: item.id,
          children: (item.children || []).map((item: any) => ({
            label: item.name,
            value: item.id
          }))
        }))
      }, () => {
        cb()
      })
    }, () => {
      this.setState({
        loading: false
      })
    })
  }
  public setData = () => {
    api.getCategory().then(res => {
      this.form.setValues(res)
    })
  }
  public handleSave = () => {
    this.form.props.form.validateFields((err, value) => {
      if (err) {
        return
      }
      api.setCategory(value).then(() => {
        APP.success('设置成功')
      })
    })
  }
  render () {
    const { loading, oneSubject, twoSubject } = this.state
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
            {
              oneSubject.length ? (
                <FormItem
                  inner={(form) => {
                    return form.getFieldDecorator('oneSubject')(
                      <RelationCheckbox
                        filterAllIds={false}
                        divider={false}
                        oneAllSelectShow={false}
                        options={oneSubject}
                      />
                    )
                  }}
                />
              ) : (
                <Empty />
              )
            }
          </Card>
          <Card title='二级类目'>
            {
              twoSubject.length ? (
                <FormItem
                  inner={(form) => {
                    return form.getFieldDecorator('twoSubject')(
                      <RelationCheckbox
                        filterAllIds={false}
                        oneSpan={4}
                        twoSpan={20}
                        divider={false}
                        options={twoSubject}
                      />
                    )
                  }}
                />
              ) : (
                <Empty />
              )
            }
          </Card>
          {
            !!(oneSubject.length || twoSubject.length) && (
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
            )
          }
        </Form>
      </div>
    )
  }
}

export default Main
