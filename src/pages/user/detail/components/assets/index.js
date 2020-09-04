import React, { useState } from 'react';
import { Menu } from 'antd';
import { withRouter, Route, Switch } from 'react-router-dom';
import Coupon from './coupon';
import Integral from './integral'

function Assets({ match, history }) {
  const [current, setCurrent] = useState('coupon');
  const handleClick = (e) => {
    setCurrent(e.key);
  }
  return (
    <>
      <Menu mode="horizontal" onClick={handleClick} selectedKeys={[current]}>
        <Menu.Item key="coupon">优惠券</Menu.Item>
        {/* <Menu.Item key="activationCode">激活码</Menu.Item> */}
        <Menu.Item key="integral">积分</Menu.Item>
      </Menu>
      {/* <Switch>
        <Route path={`${match.url}`} component={Coupon}></Route>
      </Switch> */}
      {current === 'coupon' && <Coupon />}
      {current === 'integral' && <Integral />}
    </>
  )
}
export default withRouter(Assets);