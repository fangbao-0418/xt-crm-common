import React, { Component } from 'react';
import { Card, Descriptions } from 'antd';
import moment from 'moment';
import { connect, parseQuery, setQuery } from '@/util/utils';
import styles from './index.module.scss';
import Modal from './modal';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';
let unlisten = '';

@connect(state => ({
    data: state['user.userinfo'].userinfo,
    loading: state.loading.effects['user.userinfo'].getUserInfo
}))
export default class extends Component {

    constructor(props) {
        super(props);
        const { getInstance } = this.props;
        if (typeof getInstance === 'function') getInstance(this);
    }

    componentDidMount() {
        this.handleSearch();
        unlisten = this.props.history.listen(() => {
            const obj = parseQuery(this.props.history);
            const tab = obj.tab || 'userinfo';
            const params = {
                memberId: obj.memberId
            };
            tab === 'userinfo' && this.handleSearch(params)
        })
    }

    handleSearch = (params = {}) => {
        const { history, dispatch } = this.props;
        const obj = parseQuery(history);
        const payload = {
            memberId: params.memberId || obj.memberId
        };
        dispatch['user.userinfo'].getUserInfo(payload);
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

    componentWillUnmount() {
        unlisten();
    }
    render() {
        // <a href="javascript:;" onClick={this.showModal}>修改邀请人</a>&nbsp;&nbsp;
        const { data, loading } = this.props;
        return (
            <div>
                <Card
                   title="用户信息"
                   style={{ marginBottom: 20 }}
                   headStyle={{
                       fontWeight: 900
                   }}
                   extra={<div><a href="javascript:;" onClick={this.showModal}>用户信息编辑</a></div>}
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
                        <Descriptions.Item label="注册时间">{data.createTime ? moment(data.createTime).format(timeFormat) : ''}</Descriptions.Item>
                        <Descriptions.Item label="手机号">{data.phone}</Descriptions.Item>
                        <Descriptions.Item label="等级">{data.memberTypeDO ? data.memberTypeDO.value : ''}</Descriptions.Item>
                        <Descriptions.Item label=" 微信">{data.wechat || '暂无'}</Descriptions.Item>
                        <Descriptions.Item label="注册来源">{data.registerForm || '暂无'}</Descriptions.Item>
                        <Descriptions.Item label="上级">
                            <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={() => setQuery({ memberId: data.parentMemberId })}>{data.parentName}</span> {data.parentMemberTypeDO ? data.parentMemberTypeDO.value : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="邀请人">
                            <span style={{ cursor: 'pointer', color: '#40a9ff' }} onClick={() => setQuery({ memberId: data.inviteId })}>{data.inviteName}</span> {data.inviteMemberTypeDO ? data.inviteMemberTypeDO.value : ''}
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
                   loading={loading}
                >
                    <div className={styles.income}>
                        <div className={styles.content}>
                            <span className={styles.key}>总收益：</span>
                            <span>{data.totalAccount ? data.totalAccount/100 : 0}</span>
                        </div>
                        <div className={styles.content}>
                            <span className={styles.key}>已到账：</span>
                            <span>{data.alreadyAccount ? data.alreadyAccount/100 : 0}</span>
                        </div>
                        <div className={styles.content}>
                            <span className={styles.key}>待到账：</span>
                            <span>{data.stayAccount ? data.stayAccount/100 : 0}</span>
                        </div>
                        <div className={styles.content}>
                            <span className={styles.key}>冻结中：</span>
                            <span>{data.freezeAccount ? data.freezeAccount/100 : 0}</span>
                        </div>
                        <div className={styles.content}>
                            <span className={styles.key}>已提现：</span>
                            <span>{data.presentedAccount ? data.presentedAccount/100 : 0}</span>
                        </div>
                    </div>
                </Card>
                <Modal />
            </div>
        )
    }
}