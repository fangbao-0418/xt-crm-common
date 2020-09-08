import React from 'react'
import { Button, Radio } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig, locationMap, displayFromMap } from './config'
import RelevanceGoods from './components/RelevanceGoods'
import RelevanceShop from './components/RelevanceShop'
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
        res.displayFrom = displayFromMap.value[res.displayFrom]
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
          {/* <FormItem
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
          /> */}
          <FormItem
            label='推荐内容'
            required
            inner={(form) => {
              return form.getFieldDecorator('relationType', {
                initialValue: 10
              })(
                <Radio.Group>
                  <Radio value={10}>关联商品</Radio>
                  <Radio value={20}>关联店铺</Radio>
                </Radio.Group>
              )
            }}
          />
          <FormItem
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            style={{ marginBottom: 0 }}
            inner={(form) => {
              const relationType = form.getFieldValue('relationType')
              return relationType === 10 ? (
                <FormItem
                  inner={(form) => {
                    return form.getFieldDecorator('productRecommendSpuList', {
                      rules: [
                        {
                          validator: (rule, value, cb) => {
                            if (!value || value.length === 0) {
                              cb('关联商品不能为空')
                            } else {
                              cb()
                            }
                          }
                        }
                      ]
                    })(
                      <RelevanceGoods readonly={readonly} />
                    )
                  }}
                />
              ) : (
                <FormItem
                  inner={(form) => {
                    return form.getFieldDecorator('relationIdList', {
                      rules: [
                        {
                          validator: (rule, value, cb) => {
                            if (!value || value.length === 0) {
                              cb('关联店铺不能为空')
                            } else {
                              cb()
                            }
                          }
                        }
                      ]
                    })(
                      <RelevanceShop readonly={readonly} />
                    )
                  }}
                />
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
