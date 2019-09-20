import React, { useState } from 'react';
import { Button, Form, Icon, Input, Select } from 'antd';
import logo from '@/assets/images/logo.svg';
import styles from './login.module.scss';
import { connect } from '@/util/utils';
import domains from "./domain";
const FormItem = Form.Item;

const LoginPage = (props) => {
  let userNameInput = null;
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const emitEmptyUserName = () => {
    userNameInput.focus();
    setUserName('');
  };

  const gotoLogin = e => {
    e.preventDefault();
    if(domain) sessionStorage.setItem('apidomain', domain);
    props.dispatch({
      type: 'login/login',
      payload: {
        params: { username, password },
        history: props.history
      },
    })
  };
  const userNameSuffix = username ? <Icon type="close-circle" onClick={emitEmptyUserName} /> : null;
  return (
    <>
      <div className={styles.header}>
        <div className={styles['header-wrapper']}>
          <header>
            <a href="/">
              <img src={logo} alt="ant design mini" />
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
              placeholder="请输入账号"
              prefix={<Icon type="user" />}
              suffix={userNameSuffix}
              value={username}
              onChange={e => setUserName(e.target.value)}
              ref={node => (userNameInput = node)}
              size="large"
            />
          </FormItem>
          <FormItem>
            <Input
              type="password"
              placeholder="请输入密码"
              prefix={<Icon type="eye" />}
              value={password}
              onChange={e => setPassword(e.target.value)}
              size="large"
            />
          </FormItem>
          {!(process.env.PUB_ENV == 'prod' || process.env.PUB_ENV == 'pre') && <FormItem>
            <Select 
              placeholder="选择环境域名"
              onChange={e => setDomain(e)}
            >
              {domains.map((val, i) => {
                return <Select.Option value={val[1]} key={i}>{val[0]}</Select.Option>
              })}
            </Select>
          </FormItem>}
          <FormItem>
            <Button type="primary" htmlType="submit" className={styles['login-form-button']}>
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
      <div className={styles['footer']}>版权所有 © 喜团有限公司 2019</div>
    </>
  );
};

export default connect()(LoginPage);
