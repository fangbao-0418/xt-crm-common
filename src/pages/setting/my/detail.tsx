import React from 'react'
import { Card, Row, Col, Checkbox, Button, Icon, Modal } from 'antd'
import classNames from 'classnames'
import styles from './style.module.styl'
import * as api from './api'
import { platformCodesOptions, memberTypesOptions } from './config'
import Form, { FormItem, FormInstance } from '@/packages/common/components/form'
import { parseQuery } from '@/util/utils'
import * as adapter from './adapter'
import RadioButton from './components/RadioButton'
import Upload from '@/components/upload'
import homeIcon from '@/assets/images/home.png'
import yanxuanIcon from '@/assets/images/yanxuan.png'
import cartIcon from '@/assets/images/cart.png'
import myIcon from '@/assets/images/my.png'
interface State {
  visible: boolean
    /** 版本ID */
  versionID: number
  memberType: string
  platformCode: string
  list: any[]
  myHeadIcons: any[]
  id?: number
  // 1-工具与服务 2-常用工具
  addType: 1 | 2
}
class Main extends React.Component<any, State> {
  public state: State
  public form: FormInstance
  public readonly?: string = (parseQuery() as any).readOnly
  public constructor (props: any) {
    super(props)
    this.state = {
      versionID: Number(props.match.params.id),
      visible: !this.readonly,
      memberType: '',
      platformCode: '',
      list: [],
      myHeadIcons: [],
      addType: 1
    }
    this.handleAdd = this.handleAdd.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }
  public componentDidMount () {
    this.fetchData(false)
  }
  /**
   * 根据版本号id获取版本详情
   */
  public async fetchData (canReset: boolean = true) {
    if (canReset) {
      this.handleReset()
    }
    const res = await api.getIconList({
      id: this.state.versionID,
      memberType: this.state.memberType,
      platformCode: this.state.platformCode
    })
    this.setState({
      list: res?.myBottomIcons || [],
      myHeadIcons: res?.myHeadIcons || []
    })
  }
  /**
   * 新增
   * @param (1|2) type - 1-工具与服务 2-常用工具
   * */
  public handleAdd = (type: 1 | 2 = 2) => () => {
    this.handleReset()
    this.setState({
      addType: type,
      visible: true,
      id: undefined
    })
  }
  /** 新增/编辑 */
  public handleSave () {
    this.form.props.form.validateFields(async (error, vals) => {
      if (!error) {
        let result: boolean
        vals.personalModuleConfigId = this.state.versionID
        vals.iconLayout = this.state.addType
        /** 过滤all */
        vals.platformCodes = (vals.platformCodes || []).filter((item: string) => item !== 'all');
        vals.memberTypes = (vals.memberTypes || []).filter((item: string) => item !== 'all');
        /** 新增 */
        if (this.state.id) {
          vals.id =this.state.id
          result = await api.editIcon(vals)
        } else {
          result = await api.addIcon(vals)
        }
        if (result) {
          const operateMsg = this.state.id ? '编辑' : '新增'
          APP.success(`${operateMsg}成功`)
          this.fetchData()
        }
      }
    })
  }
  /** 重置form配置 */
  public handleReset () {
    this.form && this.form.props.form.resetFields()
    this.setState({ visible: false })
  }
  /** 删除icon配置 */
  public handleDelete () {
    Modal.confirm({
      title: '系统提示',
      content: '是否确认删除icon',
      onOk: async () => {
        const result = await api.deleteIcon({ id: this.state.id })
        if (result) {
          APP.success('删除icon成功')
          this.fetchData()
        }
      }
    })
  }
  /** 编辑icon */
  public edit (config: any) {
    console.log(config, 'config')
    this.handleReset()
    this.setState({
      addType: config.iconLayout,
      visible: true,
      id: config.id
    }, ()=>{
      this.form.setValues(adapter.handleFormData(config))
    })
  }
  public render() {
    const { visible, list, myHeadIcons } = this.state
    return (
      <Card>
        <Row className={styles.row}>
          <Col span={12} className={styles.col}>
            <h2 className={styles.title}>个人中心配置</h2>
            <div className={styles.wrap}>
              <div className={styles.linkBlock}>
                <div className={styles['link-label']}>
                  常用工具
                </div>
                <div
                  style={{
                    background: '#cc0111',
                    overflow: 'hidden',
                    padding: '8px 0px'
                  }}
                >
                  {myHeadIcons.map(v => (
                    <div key={v.id} className={styles.link} onClick={() => this.edit(v)}>
                      <img src={v.iconUrl} alt="" />
                      <p style={{ color: '#FFFFFF' }}>{v.iconName}</p>
                    </div>
                  ))}
                  {!this.readonly && myHeadIcons.length < 4 && (
                    <div className={styles.linkPlus} onClick={this.handleAdd(2)}>
                      <div className={styles.linkPlusBtn}>
                        <Icon type="plus" />
                      </div>
                    </div>
                  )}
                </div>
                <div className='clear pt20'></div>
                <div className={classNames(styles['link-label'])}>
                  工具与服务
                </div>
                {list.map(v => (
                  <div key={v.id} className={styles.link} onClick={() => this.edit(v)}>
                    <img src={v.iconUrl} alt='' />
                    <p>{v.iconName}</p>
                  </div>
                ))}
                {!this.readonly && (
                  <div className={styles.linkPlus} onClick={this.handleAdd(1)}>
                    <div className={styles.linkPlusBtn}>
                      <Icon type='plus' />
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.footer}>
                <div className={styles.item}>
                  <img src={homeIcon} alt='' />
                  <p>首页</p>
                </div>
                <div className={styles.item}>
                  <img src={yanxuanIcon} alt='' />
                  <p>严选</p>
                </div>
                <div className={styles.item}>
                  <img src={cartIcon} alt='' />
                  <p>购物车</p>
                </div>
                <div className={styles.item}>
                  <img src={myIcon} alt='' />
                  <p className={styles.active}>我的</p>
                </div>
              </div>
            </div>
            <div className={styles.search}>
              <RadioButton
                dataSource={platformCodesOptions}
                value={this.state.platformCode}
                onChange={(platformCode: string) => {
                  this.setState({ platformCode }, () => this.fetchData(false))
                }}
              />
              <RadioButton
                className='mt10'
                dataSource={memberTypesOptions}
                value={this.state.memberType}
                onChange={(memberType: string) => {
                  this.setState({ memberType }, () => this.fetchData(false))
                }}
              />
              <div className='mt10'>版本号：{this.state.versionID}</div>
            </div>
          </Col>
          {visible && (
            <Col span={12} className={styles.col}>
              <h2 className={styles.title}>
                <span>
                  {!!this.readonly ? '查看' : !!this.state.id ? '编辑' : '新增'}icon配置 - {this.state.addType === 1 ? '工具与服务' : '常用工具'}
                </span>
                <Icon type="close-circle" className={styles.closeCircle} onClick={this.handleReset} />
              </h2>
              <Form
                readonly={!!this.readonly}
                getInstance={ref => (this.form = ref)}
              >
                <FormItem
                  name='iconName'
                  type='input'
                  label='icon名称'
                  verifiable={true}
                  fieldDecoratorOptions={{
                    rules: [
                      {
                        required: true,
                        message: '请输入icon名称'
                      }
                    ]
                  }}
                  controlProps={{
                    style: {
                      width: 200
                    }
                  }}
                />
                <FormItem
                  label='上传图片'
                  required
                  inner={form => {
                    return form.getFieldDecorator('iconUrl',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请上传图片'
                          }
                        ]
                      })(<Upload listType='picture-card' placeholder='上传' />)
                  }}
                />
                <FormItem
                  name='sort'
                  type='number'
                  label='排序'
                  verifiable={true}
                  controlProps={{
                    placeholder: '排序越大越靠前',
                    precision: 0,
                    min: 0,
                    max: 255,
                    style: {
                      width: 200
                    }
                  }}
                  fieldDecoratorOptions={{
                    rules: [
                      {
                        required: true,
                        message: '请输入排序'
                      }
                    ]
                  }}
                />
                <FormItem
                  name='url'
                  type='input'
                  label='地址'
                  verifiable={true}
                  controlProps={{
                    placeholder: '请输入内容',
                    style: {
                      width: 350
                    }
                  }}
                  fieldDecoratorOptions={{
                    rules: [
                      {
                        required: true,
                        message: '请输入地址'
                      }
                    ]
                  }}
                />
                <FormItem
                  label="显示端口"
                  type='checkbox'
                  name='platformCodes'
                  verifiable={true}
                  allValue={'all'}
                  options={[{label: '全部', value: 'all'}].concat(platformCodesOptions)}
                  fieldDecoratorOptions={{
                    rules: [
                      {
                        required: true,
                        message: '请选择显示端口'
                      }
                    ]
                  }}
                />
                <FormItem
                  label="显示用户"
                  type='checkbox'
                  name='memberTypes'
                  verifiable={true}
                  allValue={'all'}
                  options={[{label: '全部', value: 'all'}].concat(memberTypesOptions)}
                  fieldDecoratorOptions={{
                    rules: [
                      {
                        required: true,
                        message: '请选择显示用户'
                      }
                    ]
                  }}
                />
                <FormItem
                  hidden={!!this.readonly}
                  inner={form => {
                    return (
                      <>
                        <Button type='primary' onClick={this.handleSave}>
                          保存
                        </Button>
                        { !!this.state.id && (
                          <Button type='danger' className='ml10' onClick={this.handleDelete}>
                              删除
                          </Button>
                        )
                        }
                      </>
                    )
                  }}
                />
              </Form>
            </Col>
          )}
        </Row>
      </Card>
    )
  }
}
export default Main
