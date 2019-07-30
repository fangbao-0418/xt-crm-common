import React from 'react';
import { Dropdown, Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';
import styles from './header.module.scss';
import * as LocalStorage from '@/util/localstorage';

function menu(logout) {
  return (
    <Menu>
    {/* <Menu.Item key="1">
      <Link to="/settings">
        <Icon type="setting" />&nbsp;重置密码
      </Link>
    </Menu.Item> */}
    <Menu.Divider />
    <Menu.Item key="2">
      <Link to="/login" onClick={() => logout()}>
        <Icon type="poweroff" />&nbsp;退出登录
      </Link>
    </Menu.Item>
  </Menu>
  );
}

const Header = ({collapsed, setCollapsed, logout}) => {
  const user = LocalStorage.get('user') || {};
  return (
    <div className={styles['header-wrapper']}>
      <span className={styles['header-collapsed']} onClick={() => setCollapsed(!collapsed)}>
        <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
      </span>
      <div className={styles['header-user-info']}>
        <Dropdown overlay={menu(logout)} placement="bottomRight">
          <span className={styles['header-dropdown-link']}>
            <Icon type="user" /> {user.username} <Icon type="down" />
          </span>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;