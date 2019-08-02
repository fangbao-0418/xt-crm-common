import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu, Layout } from 'antd';
import * as LocalStorage from '@/util/localstorage'
import styles from './sidebar.module.scss';
import logo from '../../assets/images/logo.svg';
const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = props => {
  const selectedMenu = window.location.hash;
  const { collapsed } = props;
  const [current, setCurrent] = useState(selectedMenu);
  return (
    <Sider collapsed={collapsed} style={{
      overflow: 'auto',
      height: '100vh',
      position: 'fixed',
      left: 0,
    }}>
      <div className={styles.logo}>
        <a href="/">
          <img src={logo} alt="logo" />
          <h1>喜团管理平台</h1>
        </a>
      </div>
      <Menu
        theme="dark"
        onClick={e => setCurrent(e.key)}
        style={{ padding: '16px 0', width: '100%' }}
        selectedKeys={[current]}
        defaultOpenKeys={['goods', 'order']}
        mode="inline"
      >
        {props.data.map(item => {
          if (item.subMenus instanceof Array && item.subMenus.length) {
            return (
              <SubMenu
                key={item.id}
                title={
                  <span>
                    {
                      item.icon && <Icon type={item.icon} />
                    }
                    <span>{item.name}</span>
                  </span>
                }
              >
                {item.subMenus.map(subItem => (
                  <Menu.Item key={subItem.id}>
                    <Link to={subItem.path || '/'}>{subItem.name}</Link>
                  </Menu.Item>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item key={item.id}>
                <Link to={item.path || '/'}>
                  {item.icon && <Icon type={item.icon} />}
                  <span>{item.name}</span>
                </Link>
              </Menu.Item>
            );
          }
        })}
        {/* {
          renderMenulist(menulist)
        } */}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
