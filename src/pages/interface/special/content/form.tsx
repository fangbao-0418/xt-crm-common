import React from 'react'
import { Card, Button } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import Content from '../components/content'
import styles from '../style.module.sass'
import { RouteComponentProps, withRouter } from 'react-router'
import { FormComponentProps } from 'antd/es/form'
import { namespace } from './model'
import { connect } from 'react-redux'
import { saveSubjectFloor } from './api'
interface Props extends FormComponentProps, RouteComponentProps<{ id: any }> {
  detail: Special.DetailProps
}
class Main extends React.Component<Props> {
  public form: FormInstance
  public id: number = -1
  public componentDidMount () {
    const { id } = this.props.match.params
    this.id = +id
    /** 编辑回显 */
    if (this.id !== -1) {
      this.fetchDetail()
    }
  }
  public componentWillUnmount () {
    APP.dispatch({
      type: `${namespace}/@@init`
    })
  }
  /** 添加楼层 */
  public addContent (type: 1 | 2 | 3 | 4) {
    const { detail } = this.props
    detail.list.push({
      type,
      sort: 0,
      products: [],
      coupons: []
    })
    APP.dispatch({
      type: `${namespace}/changeDetail`,
      payload: { ...detail }
    })
  }

  /** 获取楼层详情 */
  public async fetchDetail () {
    APP.dispatch({
      type: `${namespace}/fetchDetail`,
      payload: {
        id: this.id,
        cb: (res: any) => {
          this.form.setValues(res)
        }
      }
    })   
  }
  /** 取消 */
  public handleCancel = () => {
    APP.history.go(-1)
  }
  /** 保存 */
  public handleSave = () => {
    const { detail } = this.props
    this.form.props.form.validateFields(async (err, vals) => {
      // const list = detail.list || []
      // list.map((item) => {
      //   if (item.type === 4 && item.content) {
      //     const coordinates = (item.content.area || []).map((val) => val.coordinate)
      //     console.log(coordinates, 'coordinates')
      //   }
      // })
      // console.log(detail, 'detail')
      // APP.error('xxx')
      if (!err) {
        const res = await saveSubjectFloor({
          ...detail,
          ...vals,
          id: this.id !== -1 ? this.id : void 0
        })
        if (res) {
          APP.success(`${this.id === -1 ? '新增' : '编辑'}专题内容成功`)
          APP.history.go(-1)
        }
      }
    })
  }
  public render () {
    return (
      <Card title='新增/编辑专题内容'>
        <Form
          getInstance={ref => this.form = ref}
        >
          <FormItem
            name='floorName'
            label='名称'
            controlProps={{
              style: {
                width: 220
              }
            }}
            verifiable
            fieldDecoratorOptions={{
              rules: [{
                required: true,
                message: '请输入名称'
              }]
            }}
          />
          <FormItem
            name='status'
            label='启用状态'
            verifiable
            fieldDecoratorOptions={{
              initialValue: 1,
              rules: [{
                required: true,
                message: '请输入启用状态'
              }]
            }}
            type='radio'
            options={[{
              label: '启用',
              value: 1
            }, {
              // label: (
              //   <>停用<span style={{ color: '#ff4d4f'}}>（活动中的专题内容无法停用）</span></>
              // ),
              label: '停用',
              value: 0
            }]}
          />
          {this.id !== -1 && (
            <>
              <FormItem
                name='modifyTimeText'
                label='最后操作时间'
                type='text'
              />
              <FormItem
                name='operator'
                label='最后操作人'
                type='text'
              />
            </>
          )}
          <FormItem
            label='添加楼层'
          >
            <Button
              type='primary'
              className='mr8'
              onClick={() => this.addContent(3)}
            >
              广告
            </Button>
            <Button type='primary' className='mr8' onClick={() => this.addContent(2)}>优惠券</Button>
            <Button
              type='primary'
              className='mr8'
              onClick={() => this.addContent(1)}
            >
              商品
            </Button>
            <Button
              type='primary'
              onClick={() => this.addContent(4)}
            >
              图片热区
            </Button>
          </FormItem>
          <FormItem>
            <Content
              style={{ width: 800 }}
            />
          </FormItem>
          <FormItem style={{ marginTop: 100 }}>
            <Button
              type='primary'
              onClick={this.handleSave}>
              保存
            </Button>
            <Button
              className='ml10'
              onClick={this.handleCancel}>
              取消
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(connect((state: any) => {
  return {
    detail: state[namespace].detail
  }
})(withRouter(Main)))
