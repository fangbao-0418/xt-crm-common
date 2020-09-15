import React from 'react'
import { Card, Descriptions, Table, Button, Form, Select, Modal, Input, Switch, InputNumber } from 'antd'
import moment from 'moment'
import styles from './index.module.scss'
import { memberModify, getReasonList, setMemberUnlocking, relieveWechat, addBlack, delBlack } from '../../api'
import { connect, parseQuery, setQuery } from '@/util/utils'
import { levelName } from '../../../utils';

interface Props {
  data: any
  history: any
  dispatch: any
  bizSource: any
}

const timeFormat = 'YYYY-MM-DD HH:mm:ss'
function formatTime (text: any) {
  return text ? moment(text).format(timeFormat) : '';
}

class Main extends React.Component<Props> {
    // 修改会员身份
    modifyMemberType = (type = 0) => {
      this.setState({
        visible: true,
        upOrDwon: type
      })
    }
  handleSearch = (params: any = {}) => {
    const { history, dispatch } = this.props
    const obj = parseQuery() as any
    dispatch['user.userinfo'].getUserInfo({
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
  handleUnlock = (memberId: any) => {
    Modal.confirm({
      title: '系统提示',
      content: '确定要解锁吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setMemberUnlocking({ memberId: memberId }).then((res: any) => {
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
  public render () {
    const { data } = this.props
    return (
      <div>
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
      </div>
    )
  }
}
export default connect((state: any) => ({
  data: state['user.userinfo'].userinfo,
  loading: state.loading.effects['user.userinfo'].getUserInfo
}))(Main) as any
