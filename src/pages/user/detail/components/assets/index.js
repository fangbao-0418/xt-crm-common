import React, { useState } from 'react';
import { Menu } from 'antd';
import { withRouter, Route, Switch } from 'react-router-dom';
import Coupon from './coupon';

function Assets({ match, history }) {
  const [current, setCurrent] = useState('coupon');
  const handleClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    console.log('history=>', history);
  }
  return (
    <>
      <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]}>
        <Menu.Item key="coupon">优惠券</Menu.Item>
        {/* <Menu.Item key="activationCode">激活码</Menu.Item> */}
      </Menu>
      <Switch>
        <Route path={`${match.url}`} component={Coupon}></Route>
      </Switch>
    </>
  )
}
export default withRouter(Assets);