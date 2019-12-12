import React, { Component } from 'react';
import { Card, Descriptions, Table, Button, Form, Select, Modal, Input, Switch } from 'antd';
import moment from 'moment';
import { connect, parseQuery, setQuery } from '@/util/utils';
import styles from './index.module.scss';
import UserModal from './modal';
import ModalInvit from './modalInvit';
import { levelName } from '../../../utils';
import { memberModify, getReasonList, setMemberUnlocking } from '../../api'
import { FormItem } from '@/packages/common/components/form';
const { Option } = Select;
const { TextArea } = Input;
const timeFormat = 'YYYY-MM-DD HH:mm:ss';
let unlisten = '';
function formatTime(text) {
  return text ? moment(text).format(timeFormat): '';
}

function withModal(WrappedComponent) {
  return class extends React.Component {
    state = {
      title: '',
      visible: false
    }
    modal = {
      showModal: (payload) => {
        switch (payload.type) {
          // 保证金
          case 'bail':
            this.setState({
              label: '保证金',
              visible: true
            })
            break
          // 采购额度
          case 'purchaseQuota':
            this.setState({
              label: '采购额度',
              visible: true
            })
            break
          default:
            break
        }
        
      }
    }
    onCancel = () => {
      this.setState({ visible: false })
    }
    onOk = () => {

    }
    render () {
      const { label, visible } = this.state
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
            <div style={{ paddingLeft: 20 }}>
              <span>{label}：</span>
              <Input style={{ width: 172 }} placeholder='请输入'/>
            </div>
          </Modal>
          <WrappedComponent {...this.props} modal={this.modal}/>
        </>
      )
    }
  }
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
@Form.create()
class UserInfo extends Component {
  state = {
    checked: true, //是否开启团购会
    visible: false,
    reasonRemark: "", //升降级说明
    upOrDwon: 0 , //1 升级，-1降级。0 不处理
  }
  constructor(props) {
    super(props);
    const { getInstance } = this.props;
    if (typeof getInstance === 'function') getInstance(this);
  }

  componentDidMount() {
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
  handleUnlock = (memberId) => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要解锁吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setMemberUnlocking({memberId: memberId}).then(res => {
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
    const payload = {
      memberId: params.memberId || obj.memberId
    };
    dispatch['user.userinfo'].getUserInfo(payload);
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
    const { checked } = this.state
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
          extra={<div><span className='href' onClick={this.showModalInvit}>修改邀请人</span>&nbsp;&nbsp;<span className='href' onClick={this.showModal}>用户信息编辑</span></div>}
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
            <Descriptions.Item label="手机号">{data.phone}</Descriptions.Item>
            <Descriptions.Item label="等级">
              {levelName(data.memberTypeVO)}
              <Button disabled={(data.memberTypeVO && data.memberTypeVO.memberType > 20)} onClick={()=>this.modifyMemberType(1)} style={{ marginLeft: 20}}>升级</Button><Button disabled={(data.memberTypeVO && (!data.memberTypeVO.memberType || data.memberTypeVO.memberType > 20))} onClick={()=>this.modifyMemberType(-1)} style={{ marginLeft: 20}}>降级</Button>
            </Descriptions.Item>
            <Descriptions.Item label="微信">{data.wechat || '暂无'}</Descriptions.Item>
            <Descriptions.Item label="注册来源">{data.registerForm || '暂无'}</Descriptions.Item>
            <Descriptions.Item label="上级">
              <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={() => setQuery({ memberId: data.parentMemberId })}>{data.parentName}</span> {levelName(data.parentMemberTypeVO)}
            </Descriptions.Item>
            <Descriptions.Item label="邀请人">
              <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={() => setQuery({ memberId: data.inviteId })}>{data.inviteName}</span>  {levelName(data.inviteMemberTypeVO)}
            </Descriptions.Item>
            <Descriptions.Item label="锁定状态">
              {data.fansTypeDesc}
              <Button disabled={(data.fansType !== 1)} onClick={()=>this.handleUnlock(data.id)} style={{ marginLeft: 20}}>解锁</Button>
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
              <span>1000元</span>
              <Button
                type='link'
                className='ml10'
                onClick={() => {
                  this.props.modal.showModal({
                    type: 'bail'
                  })
                }}>
                修改保证金
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label='开启团购会'>
              <Switch checked={checked} onChange={(checked) => this.setState({ checked })}/>
            </Descriptions.Item>
          </Descriptions>
          {checked && (
            <Descriptions column={6}>
              <Descriptions.Item label='采购额度'>3000元</Descriptions.Item>
              <Descriptions.Item label='剩余采购额度'>1000元</Descriptions.Item>
              <Descriptions.Item>
                <Button
                  type='link'
                  onClick={() => {
                    this.props.modal.showModal({
                      type: 'purchaseQuota'
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
          title="实名认证信息"
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
              <span className={styles.key}>已到账：</span>
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
        <Modal
          title={this.state.upOrDwon > 0 ? '提升用户等级':'降低用户等级'}
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
                (<Input placeholder="请输入主订单号编号"/>)
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
                })(<TextArea placeholder={'请输入说明内容'}  />)}
            </FormItem>
          </Form>

        </Modal>
      </div>
    )
  }
}
export default withModal(UserInfo)