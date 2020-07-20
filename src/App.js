/*
 * @Date: 2020-04-08 20:54:25
 * @LastEditors: fangbao
 * @LastEditTime: 2020-06-11 20:31:05
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/App.js
 */
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Routes from '@/routes'
import { connect } from 'react-redux'
import { notification } from 'antd'
import './assets/styles/common.scss'
const { get } = APP.http
import * as api from './api'

class Main extends React.Component {
  constructor (props) {
    super(props)
    APP.dispatch = props.dispatch
    APP.history = props.history
    this.fetchConfig()
    this.fetchOrderTypes()
  }
  componentDidMount () {
    const history = this.props.history
    this.checkVersion()
    this.unlisten = history.listen((location) => {
      this.checkVersion()
    })
  }
  componentWillUnmount () {
    this.unlisten?.()
  }
  checkVersion () {
    api.getBuildInfo().then((res) => {
      const build_time = res?.build_time
      if (res && BUILD_TIME !== build_time) {
        APP.moon.error('version mismatch')
        const { pathname, hash } = window.location
        let { search } = window.location
        const nowTime = new Date().getTime()
        search = (search ? search + '&' : '?') + `t=${nowTime}`
        notification.warn({
          duration: null,
          message: '系统更新',
          key: 'versionUpdatable',
          description: (
            <div>
              有新的版本已发布，为了不影响您的正常使用，请刷新浏览器后再进行操作，如果还有问题，请尝试&nbsp;
              <span
                className='href'
                onClick={() => {
                  window.location.href = `${pathname}${search}${hash}`
                }}
              >
                点击此处
              </span>
              &nbsp;刷新页面
            </div>
          )
        })
      }
    })
  }
  async fetchConfig () {
    const list = await api.getExpressList() || []
    const expressList = list.map(item => ({
      label: item.expressCompanyName,
      value: item.expressCompanyCode
    }))
    APP.constant.expressList = expressList
    APP.constant.expressConfig = this.convert2Config(expressList)
  }
  fetchOrderTypes () {
    api.getOrderTypeList().then(res => {
      const orderTypeList = res.map(item =>({ label: item.name, value: item.value }))
      APP.constant.orderTypeList = orderTypeList
      APP.constant.orderTypeConfig = this.convert2Config(orderTypeList)
    })
  }
  convert2Config (list) {
    return list.reduce((config, curr) => {
      config[curr.value] = curr.label
      return config
    }, {})
  }
  render () {
    return (
      <Routes />
    )
  }
}
Main.propTypes = {
  dispatch: PropTypes.func,
  history: PropTypes.func
}
export default withRouter(connect()(Main))
