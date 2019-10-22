import React, { PureComponent, Component } from 'react';
import { Switch, Divider, Radio } from 'antd';
import styles from './index.module.sass';
import { connect } from '@/util/utils';

const namespace = 'order.intercept.config';
@connect((state) => {
  const currentState = state[namespace];
  return {
    switchOn: currentState.switchOn,
    rule: currentState.rule
  }
})
export default class extends (PureComponent || Component) {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch[namespace].getConfig().then((res) => {
      if (res && res.success) {
        dispatch['order.intercept.config']['saveDefault']({
          switchOn: res.data === -1 ? false : true,
          rule: res.data
        })
      }
    });
  }

  render() {
    const { switchOn, rule } = this.props;
    return <div>
      <h3>订单拦截功能开关<Switch style={{ marginLeft: 16 }} checked={switchOn} onChange={this.switchChange} /></h3>
      <Divider />
      <h5>拦截规则设置</h5>
      <Radio.Group disabled={!switchOn} value={rule} onChange={this.ruleChange}>
        <Radio className={styles['radio']} value={1}>
          只拦截一级
        </Radio>
        <Radio className={styles['radio']} value={0}>
          逐级拦截
        </Radio>
      </Radio.Group>
    </div>
  }

  switchChange = (val) => {
    const { dispatch } = this.props;
    dispatch[namespace].setConfig(val ? 1 : -1);
  }

  ruleChange = (e) => {
    const { dispatch } = this.props;
    const { target: { value } } = e;
    dispatch[namespace].setConfig(value);
  }
}