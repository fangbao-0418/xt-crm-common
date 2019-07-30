import React, { Component } from 'react';
import { Card, Row, Col, Form, Checkbox, Button, Spin, Input, Icon, Modal, Table, Tree } from 'antd';
import { getCategorys } from '../api'
class Item extends Component {

  // state = {
  //   open: false,
  //   hasChildren: true,
  //   children: [],
  //   check: false
  // }

  constructor(params) {
    super(params)
    this.state = {
      open: false,
      hasChildren: true,
      children: [],
      check: params.checkData.map(val => val.id).includes(this.props.data.id)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      check: nextProps.checkData.map(val => val.id).includes(this.props.data.id)
    })
  }

  getCategorys(id) {
    if (this.state.children.length > 0 || !this.state.hasChildren) return;
    getCategorys(id).then(data => {
      if (data.length == 0) {
        return this.setState({
          hasChildren: false
        })
      }
      this.setState({
        children: data
      })
    });
  }

  switcher() {
    this.getCategorys(this.props.data.id);
    this.setState({
      open: !this.state.open
    })
  }

  checkItem() {
    const check = !this.state.check;
    this.setState({
      check
    });
    console.log(check)
    this.props.setItem([this.props.data], check)
  }

  setItem = (data, check) => {
    data.push(this.props.data)
    this.props.setItem(data, check)
  }

  render() {
    const { data } = this.props;
    return (
      <li className="ant-tree-treenode-switcher-open" role="treeitem">
        {this.state.hasChildren ? <span className={"ant-tree-switcher " + (this.state.open ? 'ant-tree-switcher_open' : 'ant-tree-switcher_close')} onClick={() => this.switcher()}>
          <Icon type="caret-down" className="ant-tree-switcher-icon" />
        </span> : <span className="ant-tree-switcher ant-tree-switcher-noop"></span>}
        <span className={"ant-tree-checkbox" + (this.state.check ? " ant-tree-checkbox-checked" : "")} onClick={() => this.checkItem()}><span className="ant-tree-checkbox-inner"></span></span>
        <span title="Expand to load" className="ant-tree-node-content-wrapper ant-tree-node-content-wrapper-open">
          <span className="ant-tree-title">{data.name}</span></span>
        {this.state.open ? <ul className="ant-tree-child-tree ant-tree-child-tree-open" data-expanded="true" role="group">
          {this.state.children.map((val, i) => {
            return <Item key={i} data={val} setItem={this.setItem} checkData={this.props.checkData}></Item>
          })}
        </ul> : ''}
      </li>)
  }
}

export default Item;