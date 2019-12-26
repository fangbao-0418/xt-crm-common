import React from 'react'
import { Button } from 'antd'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { getFieldsConfig } from './config'
import RelevanceGoods from './components/RelevanceGoods'
import { withRouter, RouteComponentProps } from 'react-router'
import * as api from './api'
interface Props extends RouteComponentProps<{id: string}> {

}
class Main extends React.Component<Props> {
  public form: FormInstance
  public id = this.props.match.params.id
  public componentDidMount () {
    this.fetchData()
  }
  public fetchData () {
    if (this.id !== '-1') {
      api.fetchDetail(this.id).then((res) => {
        this.form.setValues(res)
      })
    }
  }
  public save = () => {
    this.form.props.form.validateFields((err) => {
      const values = this.form.getValues()
      values.location = values.location.reduce((a: number, b: number) => a + b)
      values.displayFrom = values.displayFrom.reduce((a: number, b: number) => a + b)
      const productRecommendSpuList = values.productRecommendSpuList || []
      values.productRecommendSpuList = productRecommendSpuList.map((item: any) => {
        return {
          ...item,
          id: this.id === '-1' ? undefined : this.id,
          productId: item.id
        }
      })
      if (this.id === '-1') {
        api.add(values).then(() => {
          APP.success('保存成功')
          APP.history.push('/interface/goods-recommend')
        })
      } else {

      }
    })
  }
  public render () {
    return (
      <div
        style={{
          padding: 20,
          background: '#fff'
        }}
      >
        <Form
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
          <FormItem name='name' controlProps={{ style: {width: 300} }}/>
          <FormItem name='location' type='checkbox'/>
          <FormItem name='date'/>
          <FormItem
            name='displayFrom'
          />
          <FormItem
            label='关联商品'
            // name='productRecommendSpuList'
            inner={(form) => {
              return form.getFieldDecorator(
                'productRecommendSpuList'
              )(
                <RelevanceGoods />
              )
              return <RelevanceGoods />
            }}
          />
          <FormItem>
            <Button
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
