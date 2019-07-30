import React, { Component } from 'react';
import { Card, Row, Col, Form, Checkbox, Button, Spin, Input, Icon, Modal, Table, Tree } from 'antd';
import { getCategorys } from '../api'
import Item from './item';


export default class extends Component {

  constructor(params) {
    super(params)
    this.cateText = params.checkData || []
    this.state = {
      children : [],
      checkData: this.cateText
    }
  }

  componentDidMount() {
    this.getCategorys()
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps.checkData', nextProps.checkData)
    if (this.checkData != nextProps.checkData) {
      this.cateText = nextProps.checkData || []
      this.setState({
        checkData: this.cateText
      })
    }
  }

  getCategorys(id) {
    getCategorys(id).then(data => {
      this.setState({
        children: data
      })
    });
  }

  setItem = (data, check) => {
    if(check) {
      const _data = {
        id: data[0].id,
        name: ''
      };
      data.reverse().forEach(val => {
        _data.name += ">" + val.name 
      })
      _data.name = _data.name.substring(1);
      this.cateText.push(_data);
    }else{
      let _i = -1;
      this.cateText.forEach((val, i) => {
        if(val.id == data[0].id) _i = i
      });
      this.cateText.splice(_i,1);
    }
    this.props.setList(this.cateText)
  }

  render() {
    return (
      <ul className="ant-tree ant-tree-icon-hide" role="tree" unselectable="on">
        {this.state.children.map((val, i) => {
          return <Item key={i} data={val} setItem={this.setItem} checkData={this.state.checkData}></Item>
        })}
      </ul>
    )
  }
}