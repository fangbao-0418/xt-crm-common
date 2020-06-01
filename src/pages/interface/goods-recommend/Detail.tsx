import React from 'react'
import { Button } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig, locationMap } from './config'
import RelevanceGoods from './components/RelevanceGoods'
import { withRouter, RouteComponentProps } from 'react-router'
import * as api from './api'
interface Props extends RouteComponentProps<{id: string}> {
}
interface State {
  readonly: boolean
}
class Main extends React.Component<Props, State> {
  public form: FormInstance
  public id = this.props.match.params.id
  public state: State = {
    readonly: false
  }
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    if (this.id !== '-1') {
      api.fetchDetail(this.id).then((res) => {
        res.location = locationMap.value[res.location]
        res.displayFrom = locationMap.value[res.displayFrom]
        res.productRecommendSpuList = res.productRecommendSpuVOList || []
        this.form.setValues(res)
        this.setState({
          readonly: res.status === 0 ? true : false
        })
      })
    }
  }
  public save = () => {
    this.form.props.form.validateFields((err) => {
      if (err) {
        APP.error('请检查输入项')
        return
      }
      const values = this.form.getValues()
      values.location = values.location.reduce((a: number, b: number) => a + b)
      values.displayFrom = values.displayFrom.reduce((a: number, b: number) => a + b)
      const productRecommendSpuList = values.productRecommendSpuList || []
      values.productRecommendSpuList = productRecommendSpuList.map((item: any) => {
        return {
          ...item
        }
      })
      values.id = this.id === '-1' ? undefined : this.id
      if (this.id === '-1') {
        api.add(values).then(() => {
          APP.success('保存成功')
          APP.history.push('/interface/goods-recommend')
        })
      } else {
        api.update(values).then(() => {
          APP.success('保存成功')
          APP.history.push('/interface/goods-recommend')
        })
      }
    })
  }
  public render () {
    const readonly = this.state.readonly
    return (
      <div
        style={{
          padding: 20,
          background: '#fff'
        }}
      >
        <Form
          readonly={readonly}
          getInstance={(ref) => {
            this.form = ref
          }}
          config={getFieldsConfig()}
          rangeMap={{
            date: {
              fields: ['startTime', 'endTime']
            }
          }}
        >
          <FormItem verifiable name='name' controlProps={{ style: { width: 300 } }} />
          <FormItem verifiable name='location' type='checkbox' />
          <FormItem verifiable name='date' />
          <FormItem
            name='displayFrom'
            verifiable
          />
          <FormItem
            label='关联商品'
            required
            // name='productRecommendSpuList'
            inner={(form) => {
              return form.getFieldDecorator(
                'productRecommendSpuList',
                {
                  rules: [
                    {
                      validator: (rule, value, cb) => {
                        if (!value || value.length === 0) {
                          cb('关联商品不能为空')
                        }
                        cb()
                      }
                    }
                  ]
                }
              )(
                <RelevanceGoods readonly={readonly} />
              )
            }}
          />
          <FormItem>
            <Button
              hidden={readonly}
              type='primary'
              onClick={this.save}
            >
              保存
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
export default withRouter(Main)
