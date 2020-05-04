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
  findPath (data = this.props.data, pathname = this.props.pathname) {
    data = data || []
    let selectedItem
    function loop (arr) {
      return arr.find((item) => {
        if (item.path === pathname) {
          selectedItem = item
          return true
        } else {
          if (item.subMenus) {
            return !!loop(item.subMenus)
          }
        }
      })
    }
    loop(data)
    return selectedItem
  }
  componentWillReceiveProps (props) {
    let currentKey = ''
    const selectedItem = this.findPath(props.data, props.pathname)
    if (selectedItem) {
      currentKey = selectedItem.id
      this.setState({
        current: currentKey.toString()
      })
    }
  }
  render () {
    const { collapsed, data } = this.props;
    const { current } = this.state;
    console.log(current, 'current')
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
