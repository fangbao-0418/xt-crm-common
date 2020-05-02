import React, { Component } from 'react';
import { Card, Descriptions, Table, Button, Form, Select, Modal, Input, Switch, InputNumber } from 'antd';
import moment from 'moment';
import { connect, parseQuery, setQuery } from '@/util/utils';
import styles from './index.module.scss';
import UserModal from './modal';
import ModalInvit from './modalInvit';
import ModalPhone from './modalphone';
import { levelName } from '../../../utils';
import { memberModify, getReasonList, setMemberUnlocking, relieveWechat, addBlack, delBlack } from '../../api'
import { updateDepositAmount, updateCreditAmount, enablePermission, enableShopPermission } from './api'
const FormItem = Form.Item
const { Option } = Select;
const { TextArea } = Input;

const timeFormat = 'YYYY-MM-DD HH:mm:ss';
let unlisten = '';
function formatTime(text) {
  return text ? moment(text).format(timeFormat) : '';
}

function withModal(WrappedComponent) {
  return Form.create({ name: 'userinfo-modal' })(class extends React.Component {
    state = {
      title: '',
      visible: false,
      name: 'depositAmount'
    }
    constructor(props) {
      super(props)
      this.wrappedCompRef = React.createRef()
    }
    modal = {
      showModal: (payload) => {
        console.log('payload.creditAmount => ', payload.creditAmount)
        switch (payload.type) {
          // 保证金
          case 'bail':
            this.setState({
              label: '保证金',
              visible: true,
              name: 'depositAmount'
            })
            break
          // 采购额度
          case 'purchaseQuota':
            this.setState({
              label: '采购额度',
              visible: true,
              name: 'creditAmount'
            })
            break
          default:
            break
        }
        this.forceUpdate(() => {
          this.props.form.setFieldsValue({
            depositAmount: payload.depositAmount,
            creditAmount: payload.creditAmount
          })
        })
      }
    }
    onCancel = () => {
      this.setState({ visible: false })
    }
    onOk = () => {
      const { name } = this.state
      const { memberId } = parseQuery()
      this.props.form.validateFields(async (err, vals) => {
        if (!err) {
          // 保证金
          if (name === 'depositAmount') {
            const res = await updateDepositAmount({
              memberId,
              depositAmount: vals.depositAmount
            })
            if (res) {
              APP.success('修改保证金成功')
              this.wrappedCompRef.current.handleSearch()
              this.onCancel()
            }
          }
          // 采购额度
          else if (name === 'creditAmount') {
            const res = await updateCreditAmount({
              memberId,
              creditAmount: vals.creditAmount
            })
            if (res) {
              APP.success('修改采购额度成功')
              this.wrappedCompRef.current.handleSearch()
              this.onCancel()
            }
          }
        }
      })
    }
    render() {
      const { label, visible, name } = this.state
      const { form, ...otherProps } = this.props
      return (
        <>
          <Modal
            title={`修改${label}`}
            visible={visible}
            onCancel={this.onCancel}
            onOk={this.onOk}
            okText='提交'
            cancelText='取消编辑'
          >
            <Form
              layout='inline'
            >
              <FormItem
                label={label}
              >
                {form.getFieldDecorator(name, {
                  rules: [{
                    required: true,
                    message: `请输入${label}`
                  }]
                })(
                  <InputNumber
                    min={0}
                    style={{ width: 172 }}
                    placeholder='请输入'
                  />
                )}
              </FormItem>
            </Form>
          </Modal>
          <WrappedComponent
            wrappedCompRef={this.wrappedCompRef}
            {...otherProps}
            modal={this.modal}
          />
        </>
      )
    }
  })
}

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    render: (text, record, index) => {
      return index + 1;
    }
  },
  {
    title: '姓名',
    dataIndex: 'name'
  },
  {
    title: '身份证号',
    dataIndex: 'idNo'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    render: formatTime
  },
  {
    title: '最近操作时间',
    dataIndex: 'modifyTime',
    render: formatTime
  }
];
let reasonList = [];
@connect(state => ({
  data: state['user.userinfo'].userinfo,
  loading: state.loading.effects['user.userinfo'].getUserInfo
}))
@Form.create({ name: 'userinfo' })
class UserInfo extends Component {
  state = {
    enableGroupBuyPermission: false, //是否开启团购会
    enableStorePurchase: false, //是否开启团购会
    visible: false,
    switchLoading: false,
    switchShopLoading: false,
    reasonRemark: "", //升降级说明
    upOrDwon: 0, //1 升级，-1降级。0 不处理
  }
  constructor(props) {
    super(props);
    const { getInstance } = this.props;
    if (typeof getInstance === 'function') getInstance(this);
  }

  componentDidMount() {
    this.props.wrappedCompRef.current = this
    this.handleSearch();
    getReasonList().then(res => {
      console.log('getReasonList', res)
      reasonList = res
    })
    unlisten = this.props.history.listen(() => {
      const obj = parseQuery(this.props.history);
      const tab = obj.tab || 'userinfo';
      const params = {
        memberId: obj.memberId
      };
      tab === 'userinfo' && this.handleSearch(params)
    })
  }
  // 修改会员身份
  modifyMemberType = (type = 0) => {
    this.setState({
      visible: true,
      upOrDwon: type
    })
  }
  // 解除绑定
  unbind = (type) => {
    if (type === 'wechat') {
      Modal.confirm({
        title: '系统提示',
        content: '确定要解锁吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          relieveWechat({ memberId: this.props.data.id }).then(res => {
            if (res) {
              APP.success('解锁成功')
              this.handleSearch();
            }
          })
        },
      })
    }
    if (type === 'phone') {
      this.props.dispatch({
        type: 'user.userinfo/saveDefault',
        payload: {
          visiblePhone: true,
          currentData: this.props.data
        }
      })
    }
  }
  handleBlack = (enableBlack) => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要' + (enableBlack ? '解除' : '') + '拉黑吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        (enableBlack ? delBlack : addBlack)({ memberId: this.props.data.id }).then(res => {
          if (res) {
            APP.success('操作成功')
            this.handleSearch();
          }
        })
      },
    })
  }
  handleUnlock = (memberId) => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要解锁吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setMemberUnlocking({ memberId: memberId }).then(res => {
          if (res) {
            APP.success('解锁成功')
            this.handleSearch();
          }
        })
      },
    });
  }

  handleSearch = (params = {}) => {
    const { history, dispatch } = this.props;
    const obj = parseQuery(history);
    dispatch['user.userinfo'].getUserInfo({
      memberId: params.memberId || obj.memberId,
      cb: (res) => {
        this.setState({
          enableGroupBuyPermission: res.enableGroupBuyPermission,
          enableStorePurchase: res.enableStorePurchase
        })
      }
    })
  }

  showModalInvit = () => {
    this.props.dispatch({
      type: 'user.userinfo/saveDefault',
      payload: {
        visibleInvit: true,
        currentData: this.props.data
      }
    })
  }

  showModalInvit = () => {
    this.props.dispatch({
      type: 'user.userinfo/saveDefault',
      payload: {
        visibleInvit: true,
        currentData: this.props.data
      }
    })
  }

  showModal = () => {
    this.props.dispatch({
      type: 'user.userinfo/saveDefault',
      payload: {
        visible: true,
        currentData: this.props.data
      }
    })
  }

  renderHeadImage = () => {
    const { data } = this.props;

    if (data.headImage) {
      const src = data.headImage.indexOf('http') === 0 ? `${data.headImage}` : `https://assets.hzxituan.com/${data.headImage}`;
      return <img alt="头像" src={src} />
    } else {
      return '暂无'
    }
  }
  // 修改提交
  handleOk = () => {
    this.props.form.validateFields((err, value) => {
      if (err) {
        APP.error('修改失败')
        return
      }

      let params = {
        phone: this.props.data.phone, // 手机号
        memberType: this.props.data.memberTypeVO.memberType, //当前用户等级
        upOrDwon: this.state.upOrDwon,//1 升级，-1降级。0 不处理
        reasonRemark: value.reasonRemark, // 说明
        orderCode: value.orderCode, //订单号
        reasonType: value.reasonType,//  原因编号
      }
      console.log('params', params)
      memberModify(params).then(res => {
        APP.success("修改成功")
        this.setState({
          visible: false
        })
        this.handleSearch();
      })
    })
  }
  componentWillUnmount() {
    unlisten();
  }
  render() {
    const { enableGroupBuyPermission, enableStorePurchase } = this.state
    const { data, loading } = this.props;
    console.log(this.props, 'render')
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <Card
          title="用户信息"
          style={{ marginBottom: 20 }}
          headStyle={{
            fontWeight: 900
          }}
          extra={<div><span className='href' onClick={() => this.handleBlack(data.enableBlack)}>{data.enableBlack ? '解除拉黑' : '拉黑'}</span>&nbsp;&nbsp;<span className='href' onClick={this.showModalInvit}>修改邀请人</span>&nbsp;&nbsp;<span className='href' onClick={this.showModal}>用户信息编辑</span></div>}
          loading={loading}
        >
          <Descriptions column={2} className={styles.description}>
            <Descriptions.Item label="用户ID">{data.id}</Descriptions.Item>
            <Descriptions.Item label="头像">
              {
                this.renderHeadImage()
              }
            </Descriptions.Item>
            <Descriptions.Item label="用户名">{data.nickName || '暂无'}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{formatTime(data.createTime)}</Descriptions.Item>
            <Descriptions.Item label="手机号">
              {data.phone}
              <Button onClick={() => this.unbind('phone')} style={{ marginLeft: 20 }}>置换</Button>
            </Descriptions.Item>
            <Descriptions.Item label="等级">
              {levelName(data.memberTypeVO)}
              <Button disabled={(data.memberTypeVO && data.memberTypeVO.memberType > 20)} onClick={() => this.modifyMemberType(1)} style={{ marginLeft: 20 }}>升级</Button><Button disabled={(data.memberTypeVO && (!data.memberTypeVO.memberType || data.memberTypeVO.memberType > 20))} onClick={() => this.modifyMemberType(-1)} style={{ marginLeft: 20 }}>降级</Button>
            </Descriptions.Item>
            <Descriptions.Item label="微信">
              {data.wechat || '暂无'}
              <Button disabled={!data.wechat} onClick={() => this.unbind('wechat')} style={{ marginLeft: 20 }}>解绑</Button>
            </Descriptions.Item>
            <Descriptions.Item label="注册来源">{data.registerForm || '暂无'}</Descriptions.Item>
            <Descriptions.Item label="上级">
              <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={() => setQuery({ memberId: data.parentMemberId })}>{data.parentName || data.parentPhone}</span> {levelName(data.parentMemberTypeVO)}
            </Descriptions.Item>
            <Descriptions.Item label="邀请人">
              <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={() => setQuery({ memberId: data.inviteId })}>{data.inviteName || data.invitedPhone}</span>  {levelName(data.inviteMemberTypeVO)}
            </Descriptions.Item>
            <Descriptions.Item label="锁定状态">
              {data.fansTypeDesc}
              <Button disabled={(data.fansType !== 1)} onClick={() => this.handleUnlock(data.id)} style={{ marginLeft: 20 }}>解锁</Button>
            </Descriptions.Item>
          </Descriptions>
          <Descriptions title="实名认证" column={2} className={styles.authentication}>
            <Descriptions.Item label="姓名">{data.userName || '暂无'}</Descriptions.Item>
            <Descriptions.Item label="身份证号">{data.idCard || '暂无'}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card>
          <Descriptions column={1}>
            <Descriptions.Item label='保证金'>
              <span>{data.depositAmount}元</span>
              <Button
                type='link'
                className='ml10'
                onClick={() => {
                  this.props.modal.showModal({
                    type: 'bail',
                    depositAmount: data.depositAmount
                  })
                }}>
                修改保证金
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label='开启团购会'>
              <Switch
                checkedChildren='开'
                unCheckedChildren='关'
                loading={this.state.switchLoading}
                checked={enableGroupBuyPermission}
                onChange={async (checked) => {
                  console.log('checked => ', checked)
                  try {
                    this.setState({
                      switchLoading: true
                    })
                    const res = await enablePermission({
                      isOpen: checked,
                      memberId: parseQuery().memberId
                    })
                    this.setState({
                      switchLoading: false
                    })
                    if (res) {
                      APP.success(`${checked ? '开启' : '关闭'}团购会成功`)
                      this.setState({ enableGroupBuyPermission: checked })
                    }
                  } catch (error) {
                    this.setState({
                      switchLoading: false,
                      enableGroupBuyPermission: !checked
                    })
                  }
                }}
              />
            </Descriptions.Item>
            <Descriptions.Item label='开启门店采购'>
              <Switch
                checkedChildren='开'
                unCheckedChildren='关'
                loading={this.state.switchShopLoading}
                checked={enableStorePurchase}
                onChange={async (checked) => {
                  console.log('checked => ', checked)
                  try {
                    this.setState({
                      switchShopLoading: true
                    })
                    const res = await enableShopPermission({
                      enable: checked,
                      memberId: parseQuery().memberId
                    })
                    this.setState({
                      switchShopLoading: false
                    })
                    if (res) {
                      APP.success(`${checked ? '开启' : '关闭'}团购会成功`)
                      this.setState({ enableStorePurchase: checked })
                    }
                  } catch (error) {
                    this.setState({
                      switchShopLoading: false,
                      enableStorePurchase: !checked
                    })
                  }
                }}
              />
            </Descriptions.Item>
          </Descriptions>
          {enableGroupBuyPermission && (
            <Descriptions column={6}>
              <Descriptions.Item label='采购额度'>{data.creditAmount}元</Descriptions.Item>
              <Descriptions.Item label='剩余采购额度'>{data.remainCreditAmount}元</Descriptions.Item>
              <Descriptions.Item>
                <Button
                  type='link'
                  onClick={() => {
                    this.props.modal.showModal({
                      type: 'purchaseQuota',
                      creditAmount: data.creditAmount
                    })
                  }}
                >
                  修改采购额度
                </Button>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
        <Card
          title="全球购收件人"
          style={{ marginBottom: 20 }}
          headStyle={{ fontWeight: 900 }}>
          <Table
            columns={columns}
            dataSource={data.authenticationVOList}
          />
        </Card>
        <Card
          title="用户收益"
          headStyle={{
            fontWeight: 900
          }}
          loading={loading}
        >
          <div className={styles.income}>
            <div className={styles.content}>
              <span className={styles.key}>总收益：</span>
              <span>{data.totalAccount ? data.totalAccount / 100 : 0}</span>
            </div>
            <div className={styles.content}>
              <span className={styles.key}>余额：</span>
              <span>{data.alreadyAccount ? data.alreadyAccount / 100 : 0}</span>
            </div>
            <div className={styles.content}>
              <span className={styles.key}>待到账：</span>
              <span>{data.stayAccount ? data.stayAccount / 100 : 0}</span>
            </div>
            <div className={styles.content}>
              <span className={styles.key}>冻结中：</span>
              <span>{data.freezeAccount ? data.freezeAccount / 100 : 0}</span>
            </div>
            <div className={styles.content}>
              <span className={styles.key}>已提现：</span>
              <span>{data.presentedAccount ? data.presentedAccount / 100 : 0}</span>
            </div>
          </div>
        </Card>
        <UserModal />
        <ModalInvit />
        <ModalPhone />
        <Modal
          title={this.state.upOrDwon > 0 ? '提升用户等级' : '降低用户等级'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
        >
          <Form>
            <FormItem label="主订单号">
              {
                getFieldDecorator('orderCode')
                  (<Input placeholder="请输入主订单号编号" />)
              }
            </FormItem>
            <FormItem label="原因类型" required={true}>
              {getFieldDecorator('reasonType', {
                rules: [
                  {
                    required: true,
                    message: '请输入内容!'
                  }
                ],
              })(
                <Select>
                  {reasonList.map(item => <Option value={item.code} key={item.code}>{item.message}</Option>)}
                </Select>
              )
              }
            </FormItem>
            <FormItem label="说明" required={true}>
              {getFieldDecorator('reasonRemark', {
                rules: [
                  {
                    required: true,
                    message: '请输入内容!'
                  }
                ],
              })(<TextArea placeholder={'请输入说明内容'} />)}
            </FormItem>
          </Form>

        </Modal>
      </div>
    )
  }
}
export default withModal(UserInfo)