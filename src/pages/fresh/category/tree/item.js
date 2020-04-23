import React, { Component } from 'react';
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
        <span className="ant-tree-switcher ant-tree-switcher-noop"></span>
        <span className={"ant-tree-checkbox" + (this.state.check ? " ant-tree-checkbox-checked" : "")} onClick={() => this.checkItem()}><span className="ant-tree-checkbox-inner"></span></span>
        <span title="Expand to load" className="ant-tree-node-content-wrapper ant-tree-node-content-wrapper-open">
          <span className="ant-tree-title">{data.name}</span>
        </span>
      </li>)
  }
}

export default Item;