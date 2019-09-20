import React, { Component } from 'react';
import { view as XHeader } from '@/components/header';
import { view as Sidebar } from '@/components/sidebar';
import { Layout, Message } from 'antd';
import { connect } from '@/util/utils';
import * as LocalStorage from '@/util/localstorage';

const { Content, Header } = Layout;

let unlisten = null;

@connect(state => ({
  tree: state.layout.tree,
  // permissionUrlList: state.layout.permissionUrlList
}))
export default class extends Component {

  constructor(props) {
    super(props);
    const { history } = this.props;
    const { location: { pathname } } = history;
    this.state = {
      collapsed: false,
      prePathName: pathname,
      mwidth: 200,
      hasPermission: false
    }
  }

  componentDidMount() {
    const { history } = this.props;
    this.gotoAuth(history.location.pathname);
    unlisten = history.listen(() => {
      const { location: { pathname } } = history;
      const { prePathName } = this.state;
      if (pathname !== prePathName) {
        this.setState({
          prePathName: pathname
        }, () => {
          this.gotoAuth(pathname)
        })
      }
    });
    this.getMenuList();
  }

  getMenuList = () => {
    const role = LocalStorage.get('role') || {};
    const { dispatch } = this.props;
    dispatch['layout'].getMenuList(role);
  }

  gotoAuth = (pathname) => {
    const user = LocalStorage.get('user') || {};
    if (!user.id) {
      Message.info('未登录');
      this.props.history.push('/login');
      return;
    }
    // const permissionUrlList = LocalStorage.get('permissionList') || [];
    // const hasPermission = permissionUrlList.includes(pathname);
    // this.setState({
    //   hasPermission
    // });
  }

  setCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
      mwidth: this.state.collapsed ? 200 : 80
    })
  }

  logout = () => {
    LocalStorage.clear()
    sessionStorage.clear();
    Message.success('退出成功')
    // this.props.dispatch['layout'].logout();
  }

  componentWillUnmount() {
    unlisten();
  }

  render() {
    const { collapsed, hasPermission, mwidth } = this.state;
    return (
      <Layout>
        <Sidebar collapsed={collapsed} data={this.props.tree} />
        <Layout style={{ marginLeft: mwidth,overflow: 'auto', height: '100vh'}}>
          <div style={{  minWidth: '1200px'}}>
            <Header>
              <XHeader collapsed={collapsed} setCollapsed={this.setCollapsed} logout={this.logout} />
            </Header>
            {
              true ? <Content style={{ margin: 20 }}>{this.props.children}</Content> : '暂无权限'
            }
            </div>
        </Layout>
      </Layout>
    );
  }
}
