/*
 * @Date: 2019-11-12 11:03:51
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-22 17:34:36
 * @FilePath: /xt-wms/Users/fangbao/Documents/xituan/xt-crm/src/pages/login/view.js
 */
import React, { useState, useEffect } from 'react'
import { Button, Form, Icon, Input, Select } from 'antd'
import propTypes from 'prop-types'
import logo from '@/assets/images/logo.svg'
import styles from './login.module.scss'
import { connect } from '@/util/utils'
import domains from './domain'
import * as LocalStorage from '@/util/localstorage'
const FormItem = Form.Item

console.log(domains, 'domains')

const LoginPage = (props) => {
  let userNameInput = null
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [domain, setDomain] = useState('')
  const emitEmptyUserName = () => {
    userNameInput.focus()
    setUserName('')
  }
  useEffect(() => {
    APP.fn.setPayload(null)
  })
  const gotoLogin = e => {
    e.preventDefault()
    if (domain) {
      LocalStorage.put('apidomain', domain)
      domains.find((item) => {
        if (item[1] === domain) {
          localStorage.setItem('env', item[2])
          return true
        }
      })
    }
    props.dispatch({
      type: 'login/login',
      payload: {
        params: { username, password },
        history: props.history
      }
    })
  }
  const userNameSuffix = username ? <Icon type='close-circle' onClick={emitEmptyUserName} /> : null
  return (
    <>
      <div className={styles.header}>
        <div className={styles['header-wrapper']}>
          <header>
            <a>
              {/* <img src={logo} alt="ant design mini" /> */}
              <h2>喜团管理平台</h2>
            </a>
          </header>
        </div>
      </div>
      <div className={styles.content}>
        <Form onSubmit={gotoLogin} className={styles['login-form']}>
          <h3>欢迎登录</h3>
          <FormItem>
            <Input
              placeholder='请输入账号'
              prefix={<Icon type='user' />}
              suffix={userNameSuffix}
              value={username}
              onChange={e => setUserName(e.target.value)}
              ref={node => (userNameInput = node)}
              size='large'
            />
          </FormItem>
          <FormItem>
            <Input
              type='password'
              placeholder='请输入密码'
              prefix={<Icon type='eye' />}
              value={password}
              onChange={e => setPassword(e.target.value)}
              size='large'
            />
          </FormItem>
          {['prod', 'pre'].indexOf(process.env.PUB_ENV) === -1 && (
            <FormItem>
              <Select
                placeholder='选择环境域名'
                onChange={e => setDomain(e)}
              >
                {domains.map((val, i) => {
                  return <Select.Option value={val[1]} key={i}>{val[0]}</Select.Option>
                })}
              </Select>
            </FormItem>
          )}
          <FormItem>
            <Button type='primary' htmlType='submit' className={styles['login-form-button']}>
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
      <div style={{ display: 'none' }}>{process.env.PUB_ENV}</div>
      <div className={styles['footer']}>版权所有 © 喜团有限公司 {new Date().getFullYear()}</div>
    </>
  )
}

LoginPage.propTypes = {
  dispatch: propTypes.func,
  history: propTypes.object
}

export default connect()(LoginPage)
