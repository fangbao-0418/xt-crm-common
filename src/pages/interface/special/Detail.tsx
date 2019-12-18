import React from 'react'
import CouponCard from './components/content/Card'
import { Input, Button, Card, Switch, Radio, Icon, Tabs, Row, Col } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import Upload from '@/components/upload'
import * as api from './api'
import styles from './style.module.sass'
import { namespace } from './model'
import classnames from 'classnames'
import { cloneDeep } from 'lodash'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import AutoComplateSpec from './components/AutoComplateSpec'
import withModal, { Options } from './components/withModal'
import List, { Item } from './components/list'

interface Props extends RouteComponentProps<{ id: any }> {
  detail: Special.DetailItem
  modal: {
    specContentModal: (opts: Options) => void
    categoryModal: (opts: any) => void
  }
}
interface State {
  shareOpen: boolean
  type: 1 | 2
  cateText: any[],
  categorys: any[],
  activeKey: string
}

@withModal
class Main extends React.Component<Props, State> {
  public state: State = {
    shareOpen: true,
    type: 1,
    cateText: [],
    categorys: [],
    activeKey: '1'
  }
  public newTabIndex: number = 1
  public id: number = -1
  public form: FormInstance
  public constructor(props: Props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleModal = this.handleModal.bind(this)
    this.handleAddCategory = this.handleAddCategory.bind(this)
  }
  public componentDidMount() {
    this.id = +this.props.match.params.id
    if (this.id === -1) {
      this.setState({ shareOpen: true })
    } else {
      this.fetchData()
    }
  }
  /** 组件卸载清空状态 */
  public componentWillUnmount() {
    APP.dispatch({
      type: `${namespace}/@@init`
    })
  }
  /** crm查看专题活动详情 */
  public fetchData() {
    APP.dispatch({
      type: `${namespace}/fetchDetail`,
      payload: {
        id: this.id,
        cb: (result: any) => {
          this.setState({
            shareOpen: result.shareOpen === 1
          })
        }
      }
    })
  }
  /** 切换面板的回调 */
  public onChange = (activeKey: string) => {
    this.setState({ activeKey })
  }
  
  /** 新增编辑的回调 */
  public handleEdit = () => {

  }

  public handleAdd = () => {
    const { categorys, activeKey } = this.state
    categorys.push({
      floorId: '',
      id: '',
      name: `类目${this.newTabIndex++}`,
      sort: ''
    })
    console.log('categorys => ', categorys)
    this.setState({ categorys });
  }
  handleSwitch = (checked: boolean) => {
    this.setState({ shareOpen: checked });
  }
  /** 新增、编辑专题 */
  public handleSubmit() {
    this.form.props.form.validateFields((err: any, value) => {
      if (!err) {
        if (value.imgUrl instanceof Array) {
          value.imgUrl = value.imgUrl[0] && value.imgUrl[0].url
        }
        if (value.shareImgUrl instanceof Array) {
          value.shareImgUrl = value.shareImgUrl[0] && value.shareImgUrl[0].url
        }
        const params = {
          ...this.props.detail,
          ...value,
          shareOpen: this.state.shareOpen ? 1 : 0,
          type: this.state.type
        }
        api.saveSpecial(params).then((res: any) => {
          if (!!res) {
            APP.success(`专题${this.id === -1 ? '新增' : '修改'}成功`)
            APP.history.push('/interface/special')
          }
        })
      }
    })
  }
  public get imgUrl(): string | { uid: string, url: string }[] {
    const { detail } = this.props
    return typeof detail.imgUrl === 'string' ? [
      {
        uid: 'imgUrl0',
        url: detail.imgUrl
      }
    ] : detail.imgUrl;
  }
  public get shareImgUrl (): string | { uid: string, url: string }[] {
    const { detail } = this.props
    return typeof detail.shareImgUrl === 'string' ? [
      {
        uid: 'imgUrl0',
        url: detail.shareImgUrl
      }
    ] : detail.shareImgUrl;
  }
  /** 弹出选择专题内容  */
  public handleModal () {
    const { floorId } = this.form.getValues()
    this.props.modal.specContentModal({
      visible: true,
      floorId,
      cb: (hide: () => void, res: any) => {
        console.log(res.floorName, '-------------')
        this.form.setValues({
          floorId: res && res.id
        })
        hide()
      }
    })
  }
  /** 添加类目 */
  public handleAddCategory () {
    this.props.modal.categoryModal({
      categoryVisible: true,
      cb: (hide: () => void, cateText: any[]) => {
        this.setState({ cateText })
        hide()
      }
    })
  }
  public render() {
    const { detail } = this.props
    const { cateText } = this.state
    return (
      <Card title='新增/编辑专题' className={styles.detail}>
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
                initialValue: detail.subjectName,
                rules: [
                  { required: true, message: '名称不能为空' }
                ]
              }}
            />
            <FormItem
              label='支持专题分享'
              inner={(form) => {
                return form.getFieldDecorator('shareOpen')(
                  <>
                    <Switch checked={this.state.shareOpen} onChange={this.handleSwitch} />
                    <p>关闭专题分享时，则隐藏专题页面分享按钮，无法分享专题。</p>
                  </>
                )
              }}
            />
            {this.state.shareOpen &&
              <>
                <FormItem
                  name='shareTitle'
                  label='分享标题'
                  verifiable
                  fieldDecoratorOptions={{
                    initialValue: detail.shareTitle,
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
                          initialValue: this.shareImgUrl,
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
                initialValue: detail.backgroundColor,
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
                  initialValue: this.imgUrl,
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
                initialValue: detail.jumpUrl,
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
                        {form.getFieldDecorator('floorId', {
                          initialValue: detail.floorId
                        })(
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
                      </>
                    )
                  }}
                />
              </Card>
            )}
            {/* 多类目类型 */}
            {this.state.type === 1 && (
              <>
                <Card style={{ marginTop: 0 }}>
                  <p>类目通用优惠券</p>
                  <CouponCard
                    extra={false}
                    detail={{
                      type: 2,
                      list: []
                    }}
                    onChange={(value: any) => {
                      
                    }}
                  />
                </Card>
                <Card>
                  {/* <FormItem
                    name='css'
                    label='类目样式'
                    type='radio'
                    options={[{
                      label: '横排',
                      value: 1
                    }, {
                      label: '竖排',
                      value: 2
                    }]}
                  /> */}
                  {/* <FormItem
                    label='类目列表'
                  >
                    <div className={styles['intf-cat-rebox']}>
                      {cateText.map((item: any, index: number) => {
                        return (
                          <div className={styles['intf-cat-reitem']} key={index}>
                            {item.name}
                            <span
                              className={styles['close']}
                              onClick={() => {
                                const copyCateText = cloneDeep(cateText)
                                copyCateText.splice(index, 1)
                                this.setState({
                                  cateText: copyCateText
                                })
                              }}
                            >
                              <Icon type='close' />
                            </span>
                          </div>
                        )
                      })}
                      <Button
                        type='link'
                        onClick={this.handleAddCategory}
                      >
                        +添加类目
                      </Button>
                    </div>
                  </FormItem> */}
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
                    {this.state.categorys.map((item: any) => (
                      <Tabs.TabPane
                        tab={item.name}
                      >
                        <Item
                          label='类目名称'
                        >
                          <Input
                            placeholder='请输入类目名称'
                            style={{ width: 220 }}
                          />
                        </Item>
                        <Item
                          label='排序'
                        >
                          <Input
                            placeholder='请输入类目名称'
                            style={{ width: 220 }}
                          />
                        </Item>
                        <Item label='绑定专题内容'>
                          <AutoComplateSpec
                            controlProps={{
                              placeholder: '请输入专题内容标题关键字',
                              style: { width: 220 }
                            }}
                          />
                          <span
                            className={classnames('ml10', styles['download'])}
                          >
                            选择内容
                          </span>
                        </Item>
                      </Tabs.TabPane>
                    ))}
                  </Tabs>
                </Card>
                <Card>
                  <FormItem
                    name='categoryName'
                    label='类目名称'
                    controlProps={{
                      style: {
                        width: 220
                      }
                    }}
                  />
                  <FormItem
                    name='sort'
                    type='number'
                    label='排序'
                    controlProps={{
                      style: {
                        width: 220
                      },
                      min: 0
                    }}
                  />
                  <FormItem
                    label='绑定专题页'
                    inner={(form) => {
                      return (
                        <>
                          {form.getFieldDecorator('specName')(
                            <Input
                              style={{ width: 220 }}
                              placeholder='请输入专题'
                            />
                          )}
                          <span className={classnames('ml10', styles['download'])}>编辑详情</span>
                          <span className={classnames('ml10', styles['download'])}>解除绑定</span>
                          <span className={classnames('ml10', styles['download'])}>选择内容</span>
                        </>
                      )
                    }}
                  />
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
export default connect((state: any) => {
  return {
    detail: state[namespace].detail
  }
})(withRouter(Main))
