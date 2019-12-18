import React from 'react'
import { Card, Button } from 'antd'
import Form, { FormInstance, FormItem } from '@/packages/common/components/form'
import Content from '../components/content'
import { namespace } from './model'
import styles from '../style.module.sass'
import { RouteComponentProps, withRouter } from 'react-router'
interface Props extends RouteComponentProps<{ id: any }> {
  detail: Special.DetailProps
}
class Main extends React.Component<Props, any> {
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
  /** 添加楼层 */
  public addContent = (type: 1 | 2 | 3) => {
    const { detail } = this.props
    detail.list.push({
      type,
      sort: 0,
      list: [],
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
  /** 保存 */
  public handleSave = () => {

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
        />
          <FormItem
            name='status'
            label='启用状态'
            type='radio'
            options={[{
              label: '启用',
              value: 1
            }, {
              label: (
                <>停用<span style={{ color: '#ff4d4f'}}>（活动中的专题内容无法停用）</span></>
              ),
              value: 0
            }]}
          />
          {this.id !== -1 && (
            <>
              <FormItem
                name='modifyTime'
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
              className={styles.mr10}
              onClick={() => this.addContent(3)}
            >
              广告
            </Button>
            <Button type='primary' className={styles.mr10} onClick={() => this.addContent(2)}>优惠券</Button>
            <Button
              type='primary'
              onClick={() => this.addContent(1)}
            >
              商品
            </Button>
          </FormItem>
          <FormItem>
            <Content style={{ width: 800 }} />
          </FormItem>
          <FormItem style={{marginTop: 100}}>
            <Button
              type='primary'
              onClick={this.handleSave}>
              保存
            </Button>
          </FormItem>
        </Form>
      </Card>
    )
  }
}

export default withRouter(Main)