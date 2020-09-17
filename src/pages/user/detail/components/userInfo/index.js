import React, { Component } from 'react';
import { Card, Descriptions, Table, Button, Form, Select, Modal, Input, Switch, InputNumber } from 'antd';
import moment from 'moment';
import { connect, parseQuery, setQuery } from '@/util/utils';
import styles from './index.module.scss';
import UserModal from './modal';
import ModalInvit from './modalInvit';
import ModalPhone from './modalphone';
import { memberModify, getReasonList, setMemberUnlocking, relieveWechat, addBlack, delBlack } from '../../api'
import { updateDepositAmount, updateCreditAmount, enablePermission, enableShopPermission } from './api'
import { withModal } from './BailModal'
import Normal from './Normal'
import GoodStore from './GoodStore'

const FormItem = Form.Item
const { Option } = Select;
const { TextArea } = Input;

const timeFormat = 'YYYY-MM-DD HH:mm:ss';
let unlisten = '';
function formatTime(text) {
  return text ? moment(text).format(timeFormat) : '';
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
}))
@Form.create({ name: 'userinfo' })
class Main extends Component {
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
      reasonList = res
    })
    unlisten = this.props.history.listen(() => {
      const obj = parseQuery(this.props.history);
      const tab = obj.tab || 'userinfo';
      const params = {
        memberId: obj.memberId
      };
      (tab === 'userinfo' || !tab) && this.handleSearch(params)
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
      // bizSource: this.props.bizSource,
      cb: (res) => {
        this.setState({
          enableGroupBuyPermission: res.enableGroupBuyPermission,
          enableStorePurchase: res.enableStorePurchase
        })
      }
    })
    dispatch['user.userinfo'].getGoodStoreUserInfo({
      memberId: params.memberId || obj.memberId,
      cb: (res) => {
        // this.setState({
        //   enableGroupBuyPermission: res.enableGroupBuyPermission,
        //   enableStorePurchase: res.enableStorePurchase
        // })
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
    unlisten()
  }
  render() {
    const { enableGroupBuyPermission, enableStorePurchase } = this.state
    const { data, loading } = this.props;
    const { form: { getFieldDecorator }, title, style } = this.props;
    return (
      <div style={style}>
        <div style={{fontWeight: 600, fontSize: 22}}>{title}</div>
        <h3>优选业务</h3>
        <Normal
          onRefresh={(param) => {
            this.handleSearch(param)
          }}
        />
        <h3>店长业务</h3>
        <GoodStore
          onRefresh={(param) => {
            this.handleSearch(param)
          }}
        />
        <Card>
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
        <UserModal />
        <ModalInvit />
        <ModalPhone />
      </div>
    )
  }
}

export default withModal(Main)
