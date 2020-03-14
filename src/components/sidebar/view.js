import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu, Layout } from 'antd';
import styles from './sidebar.module.scss';
import logo from '../../assets/images/logo.svg';
const { SubMenu } = Menu;
const { Sider } = Layout;


function renderMenulist(data) {
  // type等于0是菜单权限，等于1是功能权限
  return data.filter(item => item.type === 0).map(item => {
    const subMenus = item.subMenus;
    if (Array.isArray(subMenus) && subMenus.length > 0 && subMenus.some(item => item.type === 0)) {
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
          {/* {subMenus.map(subItem => (
            <Menu.Item key={subItem.id}>
              <Link to={subItem.path || '/'}>{subItem.name}</Link>
            </Menu.Item>
          ))} */}
          {renderMenulist(subMenus)}
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
  })
} 
class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: ''
    }
  }
  setCurrent = (key) => {
    this.setState({
      current: key
    })
  }
  componentDidUpdate(prevProps) {
    let { pathname, data } = this.props;
    if ([prevProps.pathname, pathname].includes('/home')) return
    if (prevProps.pathname != pathname) {
      let currentKey = ''
      let selectedItem = data.find(item => item.path === pathname);
      if (!selectedItem) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].subMenus.length > 0) {
            for (let j = 0; j < data[i].subMenus.length; j++) {
              if (data[i].subMenus[j].path === pathname) {
                selectedItem = data[i].subMenus[j];
                break;
              }
            }
          }
        }
      }
      if (selectedItem) {
        currentKey = selectedItem.id
        this.setState({
          current: currentKey.toString()
        })
      }
    }
  }
  render() {
    const { collapsed, data } = this.props;
    const { current } = this.state;
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
          onClick={e => this.setCurrent(e.key)}
          style={{ padding: '16px 0', width: '100%' }}
          selectedKeys={[current]}
          defaultOpenKeys={['goods', 'order']}
          mode="inline"
        >
          {renderMenulist(data)}
        </Menu>
      </Sider>
    );
  }

}
// const Sidebar = props => {
//   const selectedMenu = window.location.hash;
//   const { collapsed } = props;
//   const [current, setCurrent] = useState(selectedMenu);

// };

export default Sidebar;
