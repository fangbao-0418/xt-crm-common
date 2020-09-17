import React from 'react'
import { Card, Descriptions, Table, Button, Form, Select, Modal, Input, Switch, InputNumber } from 'antd'
import moment from 'moment'
import styles from './index.module.scss'
import { memberModify, getReasonList, setMemberUnlocking, relieveWechat, addBlack, delBlack } from '../../api'
import { connect, parseQuery, setQuery } from '@/util/utils'
import { levelName } from '../../../utils';
import Earnings from './components/Earnings'
import { FormComponentProps } from 'antd/lib/form'

import UserModal from './modal';
import ModalInvit from './modalInvit';
import ModalPhone from './modalphone';

const FormItem = Form.Item
const { Option } = Select;
const { TextArea } = Input;
const tab = 2

interface Props extends FormComponentProps {
  data: any
  history: any
  dispatch: any
  bizSource: any
}

const timeFormat = 'YYYY-MM-DD HH:mm:ss'
function formatTime (text: any) {
  return text ? moment(text).format(timeFormat) : '';
}

let reasonList: any[] = [];

class Main extends React.Component<Props> {
  state = {
    enableGroupBuyPermission: false, //是否开启团购会
    enableStorePurchase: false, //是否开启团购会
    visible: false,
    switchLoading: false,
    switchShopLoading: false,
    reasonRemark: "", //升降级说明
    upOrDwon: 0, //1 升级，-1降级。0 不处理
  }

  componentDidMount() {
    // this.props.wrappedCompRef.current = this
    this.handleSearch();
    getReasonList().then((res: any) => {
      reasonList = res
    })
    const unlisten = this.props.history.listen(() => {
      const obj = parseQuery() as any;
      const tab = obj.tab || 'userinfo';
      const params = {
        memberId: obj.memberId
      };
      tab === 'userinfo' && this.handleSearch(params)
    })
  }

  // 修改会员身份
  modifyMemberType = (type = 0) => {
    this.changeMemberType()
    this.setState({
      visible: true,
      upOrDwon: type
    })
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
        memberType: this.props.data.memberTypeVO?.memberType, // 当前用户等级
        upOrDwon: this.state.upOrDwon,// 1 升级，-1降级。0 不处理
        reasonRemark: value.reasonRemark, // 说明
        orderCode: value.orderCode, // 订单号
        reasonType: value.reasonType, //  原因编号
        tab
      }
      // console.log('params', params)
      memberModify(params).then((res: any) => {
        APP.success("修改成功")
        this.setState({
          visible: false
        })
        this.handleSearch();
      })
    })
  }

  changeMemberType = () => {
    const { history, dispatch } = this.props
    dispatch['user.userinfo'].saveDefault({
      memberType: tab
    })
  }

  handleSearch = (params: any = {}) => {
    const { history, dispatch } = this.props
    const obj = parseQuery() as any
    dispatch['user.userinfo'].getGoodStoreUserInfo({
      memberId: params.memberId || obj.memberId,
      bizSource: this.props.bizSource,
      cb: (res: any) => {
        this.setState({
          enableGroupBuyPermission: res.enableGroupBuyPermission,
          enableStorePurchase: res.enableStorePurchase
        })
      }
    })
  }
  /** 解绑 */
  handleUnlock = (memberId: any) => {
    this.changeMemberType()
    Modal.confirm({
      title: '系统提示',
      content: '确定要解锁吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setMemberUnlocking({ memberId: memberId, tab }).then((res: any) => {
          if (res) {
            APP.success('解锁成功')
            this.handleSearch();
          }
        })
      },
    });
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
    // 解除绑定
  unbind = (type: any) => {
    if (type === 'wechat') {
      Modal.confirm({
        title: '系统提示',
        content: '确定要解锁吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          relieveWechat({ memberId: this.props.data.id }).then((res: any) => {
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
  handleBlack = (enableBlack: boolean) => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要' + (enableBlack ? '解除' : '') + '拉黑吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        (enableBlack ? delBlack : addBlack)({ memberId: this.props.data.id }).then((res: any) => {
          if (res) {
            APP.success('操作成功')
            this.handleSearch();
          }
        })
      },
    })
  }

  showModalInvit = () => {
    this.changeMemberType()
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
  public render () {
    const { data } = this.props
    const { enableGroupBuyPermission, enableStorePurchase } = this.state
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <Card
          title="用户信息"
          style={{ marginBottom: 20 }}
          headStyle={{
            fontWeight: 900
          }}
          extra={(
            <div>
              <span
                className='href'
                onClick={() => this.handleBlack(data.enableBlack)}
              >
                {data.enableBlack ? '解除拉黑' : '拉黑'}
              </span>
              &nbsp;&nbsp;
              <span
                className='href'
                onClick={this.showModalInvit}
              >
                修改邀请人
              </span>
                &nbsp;&nbsp;
              <span className='href' onClick={this.showModal}>用户信息编辑</span>
            </div>
          )}
          // loading={loading}
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
              <Button
                disabled={(data.memberTypeVO && data.memberTypeVO.memberType > 20)}
                onClick={() => this.modifyMemberType(1)} style={{ marginLeft: 20 }}
              >
                升级
              </Button>
              <Button
                disabled={(data.memberTypeVO && (!data.memberTypeVO.memberType || data.memberTypeVO.memberType > 20))}
                onClick={() => this.modifyMemberType(-1)}
                style={{ marginLeft: 20 }}
              >
                降级
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label="微信">
              {data.wechat || '暂无'}
              <Button disabled={!data.wechat} onClick={() => this.unbind('wechat')} style={{ marginLeft: 20 }}>解绑</Button>
            </Descriptions.Item>
            <Descriptions.Item label="注册来源">{data.registerForm || '暂无'}</Descriptions.Item>
            <Descriptions.Item label="上级">
              <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={() => setQuery({ memberId: data.parentMemberId })}>{data.parentName || data.parentPhone}（{levelName(data.parentMemberTypeVO)}）</span>
            </Descriptions.Item>
            <Descriptions.Item label="邀请人">
              <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={() => setQuery({ memberId: data.inviteId })}>{data.inviteName || data.invitedPhone}（{levelName(data.inviteMemberTypeVO)}）</span>
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
        <Card
          title="用户收益"
          headStyle={{
            fontWeight: 900
          }}
        >
          <Earnings data={data} />
        </Card>
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

export default connect((state: any) => {
  return {
    data: state['user.userinfo'].goodStoreUserInfo
  }
})(Form.create({ name: 'userinfo' })(Main)) as any
