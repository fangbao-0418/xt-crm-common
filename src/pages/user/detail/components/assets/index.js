import React from 'react';
import { Menu } from 'antd';
import { withRouter, Route, Switch } from 'react-router-dom';
import Coupon from './coupon';

function Assets({match}) {
  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item key="coupon">优惠券</Menu.Item>
      </Menu>
      <Switch>
        <Route path={`${match.url}/coupon`} component={Coupon}></Route>
      </Switch>
    </>
  )
}
export default withRouter(Assets);