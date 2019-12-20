import React from 'react'
import CouponCard from './components/CouponCard'
import { Input, Button, Card, Switch, Radio, Tabs, InputNumber, message } from 'antd'
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
  type: 0 | 1
  categorys: any[],
  activeKey: string
  detail: {
    css: 1 | 2,
    subjectCoupons: Special.SubjectCoupons[],
    
  }
}

function RenderText (props: any) {
  return <span>{props.value}</span>
}
@withModal
class Main extends React.Component<Props, State> {
  public state: State = {
    shareOpen: true,
    type: 0,
    categorys: [],
    activeKey: '0',
    detail: {
      css: 1,
      subjectCoupons: []
    }
  }
  public id: number = -1
  public form: FormInstance
  public newTabIndex: number = 0
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
    this.setState({
      ...res,
      detail: {
        css: res.couponStyle,
        subjectCoupons: res.subjectCoupons
      },
      activeKey: res.categorys[0] && String(res.categorys[0].id)
    })
    this.form.setValues(res)
  }
  
  /** 新增编辑的回调 */
  public handleEdit = (targetKey: string | React.MouseEvent<HTMLElement, MouseEvent>, action: 'add' | 'remove') => {
    (this as any)[action](targetKey)
  }

  public add = () => {
    const { categorys } = this.state
    const activeKey = `${this.newTabIndex++}`
    categorys.push({
      floorId: '',
      id: activeKey,
      name: '',
      sort: ''
    })
    this.setState({ categorys, activeKey });
  }
  
  /** tabs删除 */
  public remove = (targetKey: string | React.MouseEvent<HTMLElement, MouseEvent>) => {
    let { activeKey } = this.state;
    let lastIndex = 0;
    this.state.categorys.forEach((pane, i) => {
      if (String(pane.id) === targetKey) {
        lastIndex = i - 1;
      }
    });
    const categorys = this.state.categorys.filter(pane => String(pane.id) !== targetKey);
    if (categorys.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = String(categorys[lastIndex].id);
      } else {
        activeKey = String(categorys[0].id);
      }
    }
    this.setState({ categorys, activeKey });
  }
  /** Tabs切换回调 */
  public handleChange = (activeKey: string) => {
    this.setState({ activeKey })
  }

  /** 新增、编辑专题 */
  public handleSubmit = () => {
    const { categorys, type, shareOpen, detail } = this.state
    this.form.props.form.validateFields(async (err: any, value) => {
      if (!err) {
        for (let item of categorys) {
          console.log('item =>', item)
          if (item.name === '' || item.name == null) {
            message.error('类目列表类目名称不能为空')
            return
          }
          if (item.sort === '' || item.sort == null) {
            message.error('类目列表排序不能为空')
            return
          }
          if (item.name && item.name.length > 5) {
            message.error(`类目列表${item.name}类目名称不能超过5个字符`)
            return
          }
        }
        const res = await api.saveSpecial({
          ...value,
          shareOpen,
          type,
          categorys,
          ...detail,
          id: this.id !== -1 ? this.id : void 0
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
        console.log('res => ', res)
        this.form.setValues({
          floorId: res && res.id,
          floorName: res && res.floorName
        })
        hide()
      }
    })
  }
  /** 绑定专题内容 */
  public bindSpecContent (index: number) {
    const { categorys } = this.state
    this.props.modal.specContentModal({
      visible: true,
      floorId: categorys[index].floorId,
      cb: (hide: () => void, res: any) => {
        categorys[index].floorId = res.id
        categorys[index].floorName = res.floorName
        this.setState({ categorys }, hide)
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
      floorId: '',
      floorName: ''
    })
  }
  public unbind = (index: number) => {
    const { categorys } = this.state
    if (categorys[index]) {
      categorys[index]['floorId'] = ''
      categorys[index]['floorName'] = ''
    }
    this.setState({ categorys })
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
                <Radio value={0}>一般类型</Radio>
                <Radio value={1}>多类目类型</Radio>
              </Radio.Group>
            </div>
            {/* 一般类型 */}
            {this.state.type === 0 && (
              <Card style={{ marginTop: 0 }}>
                <FormItem hidden inner={form => form.getFieldDecorator('floorId')}/>
                <FormItem
                  label='绑定专题内容'
                  inner={(form) => {
                    return (
                      <>
                        {form.getFieldDecorator('floorName')(<RenderText />)}
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
            {this.state.type === 1 && (
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
                    activeKey={this.state.activeKey}
                    onChange={this.handleChange}
                    tabBarExtraContent={(
                      <Button
                        type='link'
                        size='small'
                        onClick={this.add}
                      >
                        添加类目
                      </Button>
                    )}
                    type='editable-card'
                    hideAdd
                  >
                    {this.state.categorys.map((item: any, index: number) => (
                      <Tabs.TabPane
                        key={String(item.id)}
                        tab={item.name}
                      >
                        <Item
                          label='类目名称'
                          required
                        >
                          <Input
                            value={item.name}
                            placeholder='请输入类目名称'
                            style={{ width: 220 }}
                            onChange={(e) => this.onCellChange('name', index, e.target.value)}
                          />
                          <span style={{color: '#f5222d'}}>（最多输入5个字符）</span>
                        </Item>
                        <Item
                          label='排序'
                          required
                        >
                          <InputNumber
                            value={item.sort}
                            placeholder='请输入排序'
                            style={{ width: 220 }}
                            onChange={(value) => this.onCellChange('sort', index, value)}
                          />
                        </Item>
                        <Item label='绑定专题内容'>
                          {item.floorName}
                          <span
                            className={classnames('ml10', styles['download'])}
                            onClick={() => {
                              this.bindSpecContent(index)
                            }}
                          >
                            选择内容
                          </span>
                          <span
                            className={classnames('ml10', styles['download'])}
                            onClick={() => this.unbind(index)}
                          >
                            解除绑定
                          </span>
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
