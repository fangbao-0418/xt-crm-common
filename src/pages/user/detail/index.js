import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect, parseQuery, setQuery } from '@/util/utils';
import UserInfo from './components/userInfo';
import Recommend from './components/recommend';
import Team from './components/team';
import Income from './components/income';
import Log from './components/log';
const { TabPane } = Tabs;

@connect(state => ({
    tab: state['user.userinfo'].tab,
}))
export default class extends Component {
    componentDidMount() {
        const { history, dispatch } = this.props;
        const obj = parseQuery(history);
        const tab = obj.tab || 'userinfo';
        dispatch({
            type: 'user.userinfo/saveDefault',
            payload: {
                tab
            }
        })
    }
    onChange = (tab) => {
        this.props.dispatch({
            type: 'user.userinfo/saveDefault',
            payload: {
                tab
            }
        });
        setQuery({ tab });
        if (this[tab] && tab !== 'userinfo' && typeof this[tab].handleSearch === 'function') this[tab].handleSearch({}); 
    }
    render() {
        return (
            <Tabs activeKey={this.props.tab} onChange={this.onChange}>
                <TabPane tab="用户信息" key="userinfo">
                    <UserInfo getInstance={scope => this.userinfo = scope} />
                </TabPane>
                <TabPane tab="推荐的人" key="referrer">
                    <Recommend getInstance={scope => this.referrer = scope}/>
                </TabPane>
                <TabPane tab="我的团队" key="team">
                    <Team getInstance={scope => this.team = scope}/>
                </TabPane>
                <TabPane tab="收益列表" key="income">
                    <Income getInstance={scope => this.income = scope}/>
                </TabPane>
                <TabPane tab="提现记录" key="log">
                    <Log getInstance={scope => this.log = scope}/>
                </TabPane>
            </Tabs>
        )
    }
}