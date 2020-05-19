import React from 'react'
import { Link } from 'react-router-dom'
import { findDOMNode } from 'react-dom'
import animejs from 'animejs'
import PropTypes from 'prop-types'
import { Icon, Menu, Layout } from 'antd'
import styles from './sidebar.module.scss'
import logo from '../../assets/images/logo.svg'
import routesMapRule from './routesMapRule'

const getMenuMap = (menu) => {
  return menu.reduce((pre, next) => {
    let map = {
      ...pre,
      [next.id]: next
    }
    if (next.subMenus) {
      map = {
        ...map,
        ...getMenuMap(next.subMenus)
      }
    }
    return map
  }, {})
}

const { SubMenu } = Menu
const { Sider } = Layout

class Sidebar extends React.Component {
  state = {
    current: '',
    openKeys: []
  }
  siderRef = undefined
  constructor (props) {
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
    let selectedGroup = []
    function loop (arr, group = [], isPattern = false) {
      return arr.find((item) => {
        const pattern = new RegExp('^' + item.path + '/(\\w)+$')
        // console.log(routesMapRule, item.path, 'routesMapRule')
        // console.log(routesMapRule[item.path], 'routesMapRule[pathname]')
        if (routesMapRule[item.path]?.find?.((rule) => {
          return rule.test(pathname)
        })) {
          selectedItem = item
          selectedGroup = group.concat([item])
          return true
        } else if (!isPattern && item.type === 0 && item.path === pathname) {
          selectedItem = item
          selectedGroup = group.concat([item])
          return true
        } else if (isPattern && item.path && item.type === 0 && pattern.test(pathname)) {
          selectedItem = item
          selectedGroup = group.concat([item])
          return true
        } else {
          if (item.subMenus) {
            return !!loop(item.subMenus, group.concat([item]), isPattern)
          }
        }
      })
    }
    loop(data)
    if (selectedGroup.length === 0) {
      loop(data, [], true)
    }
    // if (selectedGroup)
    return selectedGroup
  }
  componentWillReceiveProps (props) {
    let currentKey = ''
    const selectedGroup = this.findPath(props.data, props.pathname)
    currentKey = selectedGroup[selectedGroup.length - 1]?.id || ''
    const isFirst = this.props.data.length === 0
    this.setState({
      current: currentKey.toString(),
      openKeys: selectedGroup.map((item) => String(item?.id))
    }, () => {
      if (isFirst && currentKey) {
        const siderEl = findDOMNode(this.siderRef)
        const openKeys = this.state.openKeys
        const topId = openKeys[0]
        if (topId) {
          setTimeout(() => {
            const topEl = document.getElementById(`${topId}$Menu`)
            if (topEl) {
              animejs({
                targets: siderEl,
                easing: 'easeInQuad',
                scrollTop: topEl.offsetTop - 48,
                duration: 200
              })
            }
          }, 300)
        }
      }
    })
  }
  renderMenulist (data) {
    // type等于0是菜单权限，等于1是功能权限
    return data.filter(item => item.type === 0).map(item => {
      const subMenus = item.subMenus
      if (Array.isArray(subMenus) && subMenus.length > 0 && subMenus.some(item => item.type === 0)) {
        return (
          <SubMenu
            key={item.id}
            // onTitleClick={(e) => {
            //   console.log(e, 'keys')
            //   this.setState({
            //     openKeys: [e.key]
            //   })
            // }}
            title={
              <span>
                {
                  item.icon && <Icon type={item.icon} />
                }
                <span>{item.name}</span>
              </span>
            }
          >
            {this.renderMenulist(subMenus)}
          </SubMenu>
        )
      } else {
        let outside
        let path = item.path
        try {
          outside = (/^~(\/.*)$/).exec(item.path)
          path = outside ? outside[1] : path || '/'
        } catch (e) {
          //
        }
        return (
          <Menu.Item
            key={item.id}
            onClick={(e) => {
              if (outside) {
                window.open(outside[1])
              } else {
                APP.history.push(item.path)
              }
            }}
          >
            <a
              href={outside ? path : ('#' + path)}
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              {item.icon && <Icon type={item.icon} />}
              <span>{item.name}</span>
            </a>
          </Menu.Item>
        )
      }
    })
  }

  render () {
    const { collapsed, data } = this.props
    const { current, openKeys } = this.state

    return (
      <Sider
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0
        }}
        ref={(ref) => {
          this.siderRef = ref
        }}
      >
        <div className={styles.logo}>
          <a href='/'>
            {/* <img src={logo} alt='logo' /> */}
            <h1 style={{ marginLeft: 10 }}>喜团管理平台</h1>
          </a>
        </div>
        <Menu
          theme='dark'
          onOpenChange={(openKeys) => {
            this.setState({
              openKeys
            })
          }}
          style={{ padding: '16px 0', width: '100%' }}
          selectedKeys={[current]}
          openKeys={openKeys}
          mode='inline'
        >
          {this.renderMenulist(data)}
        </Menu>
      </Sider>
    )
  }

}

Sidebar.propTypes ={
  data: PropTypes.array,
  collapsed: PropTypes.bool,
  pathname: PropTypes.string
}

export default Sidebar
