import React from 'react'
import CouponCard from './components/CouponCard'
import { Input, Button, Card, Switch, Radio, Tabs, InputNumber } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import Upload from '@/components/upload'
import * as api from './api'
import styles from './style.module.sass'
import classnames from 'classnames'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import AutoComplateSpec from './components/AutoComplateSpec'
import withModal, { Options } from './components/withModal'
import { Item } from './components/list'

interface Props extends RouteComponentProps<{ id: any }> {
  modal: {
    specContentModal: (opts: Options) => void
    categoryModal: (opts: any) => void
  }
}
interface State {
  shareOpen: boolean
  type: 1 | 2
  categorys: any[],
  activeKey: string
  detail: {
    css: 1 | 2,
    subjectCoupons: Special.SubjectCoupons[]
  }
}

@withModal
class Main extends React.Component<Props, State> {
  public state: State = {
    shareOpen: true,
    type: 1,
    categorys: [],
    activeKey: '1',
    detail: {
      css: 1,
      subjectCoupons: []
    }
  }
  public newTabIndex: number = 1
  public id: number = -1
  public form: FormInstance
  public componentDidMount() {
    this.id = +this.props.match.params.id
    /** 新增 */
    if (this.id !== -1) {
      this.fetchData()
    }
  }
  /** crm查看专题活动详情 */
  public async fetchData() {
    const res = await api.fetchSpecialDetial(this.id)
    this.setState({ shareOpen: res.shareOpen })
    this.form.setValues(res)
  }
  /** 切换面板的回调 */
  public onChange = (activeKey: string) => {
    this.setState({ activeKey })
  }
  
  /** 新增编辑的回调 */
  public handleEdit = () => {

  }

  public handleAdd = () => {
    const { categorys } = this.state
    categorys.push({
      floorId: '',
      id: '',
      name: `类目${this.newTabIndex++}`,
      sort: ''
    })
    this.setState({ categorys });
  }
  /** 新增、编辑专题 */
  public handleSubmit = () => {
    this.form.props.form.validateFields(async (err: any, value) => {
      if (!err) {
        const res = await api.saveSpecial({
          ...value,
          shareOpen: this.state.shareOpen,
          type: this.state.type,
          ...this.state.detail,
          id: this.id
        })
        if (res) {
          APP.success(`专题${this.id === -1 ? '新增' : '修改'}成功`)
          APP.history.push('/interface/special')
        }
      }
    })
  }
  /** 弹出选择专题内容  */
  public handleModal = () => {
    const { floorId } = this.form.getValues()
    this.props.modal.specContentModal({
      visible: true,
      floorId,
      cb: (hide: () => void, res: any) => {
        this.form.setValues({
          floorId: res && res.id
        })
        hide()
      }
    })
  }
  /** 绑定专题内容 */
  public bindSpecContent (id: string, index: number) {
    const { categorys } = this.state
    this.props.modal.specContentModal({
      visible: true,
      floorId: categorys[index].floorId,
      cb: (hide: () => void, res: any) => {
        categorys[index].floorId = res.id
        this.setState({
          categorys
        })
        hide()
      }
    })
  }
  /** 改变list每一项数据 */
  public onCellChange (id: string, index: number, value: any) {
    const { categorys } = this.state
    if (categorys[index]) {
      categorys[index][id] = value
    }
    this.setState({ categorys })
  }
  /** 解除绑定 */
  public handleClearFloor = () => {
    this.form.setValues({
      floorId: ''
    })
  }
  /** 开关选择器 */
  public handleSwitchChange = (shareOpen: boolean) => {
    this.setState({ shareOpen })
  }
  public render() {
    const { shareOpen, detail } = this.state
    return (
      <Card
        title='新增/编辑专题'
        className={styles.detail}
      >
        <div className={styles.content}>
          <Form
            getInstance={ref => this.form = ref}
            className={styles.form}
          >
            <FormItem
              name='subjectName'
              label='名称'
              verifiable
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '名称不能为空' }
                ]
              }}
            />
            <FormItem label='支持专题分享'>
              <Switch
                checked={shareOpen}
                onChange={this.handleSwitchChange}
              />
              <p>关闭专题分享时，则隐藏专题页面分享按钮，无法分享专题。</p>
            </FormItem>
            {this.state.shareOpen &&
              <>
                <FormItem
                  name='shareTitle'
                  label='分享标题'
                  verifiable
                  fieldDecoratorOptions={{
                    rules: [
                      { required: true, message: '分享标题不能为空' },
                      {
                        max: 30,
                        message: '分享标题不能超过30个字符'
                      }
                    ]
                  }}
                />
                <FormItem
                  label='分享图片'
                  required
                  inner={(form) => {
                    return (
                      <>
                        {form.getFieldDecorator('shareImgUrl', {
                          rules: [
                            { required: true, message: '请上传专题分享图片' }
                          ]
                        })(
                          <Upload
                            accept='image/gif, image/jpeg, image/png'
                            size={0.3}
                            listType='picture-card'
                          />
                        )}
                        <p>1.专题分享图片主要用于专题分享，包括生成专题海报、分享给好友图片等，必填项。</p>
                        <p>2、图片格式支持png、gif、jpg格式（推荐使用png格式）。</p>
                        <p>3、图片尺寸为750*1000像素，大小不超过300kb。</p>
                      </>
                    )
                  }}
                />
              </>
            }
            <FormItem
              name='backgroundColor'
              label='专题背景色'
              placeholder='请输入背景色，如#FFFFFF'
              verifiable
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '专题背景色不能为空' }
                ]
              }}
            />
            <FormItem
              label='banner图片'
              required
              inner={(form) => {
                return form.getFieldDecorator('imgUrl', {
                  rules: [{
                    required: true,
                    message: 'banner图片不能为空'
                  }]
                })(
                  <Upload
                    size={0.3}
                    listType='picture-card'
                  />
                )
              }}
            />
            <FormItem
              name='jumpUrl'
              label='链接'
              verifiable
              fieldDecoratorOptions={{
                rules: [
                  { required: true, message: '请输入正确的链接地址' }
                ]
              }}
            />
            <div className={styles['spec-type-title']}>
              <span className='mr10'>专题类型</span>
              <Radio.Group
                value={this.state.type}
                onChange={(e) => this.setState({ type: e.target.value})}>
                <Radio value={1}>一般类型</Radio>
                <Radio value={2}>多类目类型</Radio>
              </Radio.Group>
            </div>
            {/* 一般类型 */}
            {this.state.type === 1 && (
              <Card style={{ marginTop: 0 }}>
                <FormItem
                  label='绑定专题内容'
                  inner={(form) => {
                    return (
                      <>
                        {form.getFieldDecorator('floorId')(
                          <AutoComplateSpec
                            controlProps={{
                              disabled: true,
                              style: { width: 220 },
                              placeholder: '请输入专题内容标题关键字'
                            }}
                          />
                        )}
                        <span
                          className={classnames('ml10', styles['download'])}
                          onClick={this.handleModal}
                        >
                          选择内容
                        </span>
                        <span
                          className={classnames('ml10', styles['download'])}
                          onClick={this.handleClearFloor}>
                          解除绑定
                        </span>
                      </>
                    )
                  }}
                />
              </Card>
            )}
            {/* 多类目类型 */}
            {this.state.type === 2 && (
              <>
                <Card style={{ marginTop: 0 }}>
                  <p>类目通用优惠券</p>
                  <CouponCard
                    extra={false}
                    detail={detail}
                    onChange={(detail: any) => {
                      this.setState({ detail })
                      console.log('detail => ', detail)
                    }}
                  />
                </Card>
                <Card>
                  <Tabs
                    onEdit={this.handleEdit}
                    tabBarExtraContent={(
                      <Button
                        type='link'
                        size='small'
                        onClick={this.handleAdd}
                      >
                        添加类目
                      </Button>
                    )}
                    type='editable-card'
                    hideAdd
                  >
                    {this.state.categorys.map((item: any, index: number) => (
                      <Tabs.TabPane
                        key={index + ''}
                        tab={item.name}
                      >
                        <Item
                          label='类目名称'
                        >
                          <Input
                            value={item.name}
                            placeholder='请输入类目名称'
                            style={{ width: 220 }}
                            onChange={(e) => this.onCellChange('name', index, e.target.value)}
                          />
                        </Item>
                        <Item
                          label='排序'
                        >
                          <InputNumber
                            value={item.sort}
                            placeholder='请输入排序'
                            style={{ width: 220 }}
                            onChange={(value) => this.onCellChange('sort', index, value)}
                          />
                        </Item>
                        <Item label='绑定专题内容'>
                          <AutoComplateSpec
                            value={item.floorId}
                            controlProps={{
                              disabled: true,
                              placeholder: '请输入专题内容标题关键字',
                              style: { width: 220 }
                            }}
                          />
                          <span
                            className={classnames('ml10', styles['download'])}
                            onClick={() => {
                              this.bindSpecContent('floorId', index)
                            }}
                          >
                            选择内容
                          </span>
                          <span className={classnames('ml10', styles['download'])}>解除绑定</span>
                        </Item>
                      </Tabs.TabPane>
                    ))}
                  </Tabs>
                </Card>
              </>
            )}
            <div className={styles.footer}>
              <Button
                type='primary'
                onClick={this.handleSubmit}
                style={{ marginRight: 20 }}
              >
                保存
              </Button>
              <Button
                onClick={() => {
                  APP.history.push('/interface/special')
                }}
              >
                取消
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    )
  }
}
export default withRouter(Main)
