import React, { Component } from 'react';
import { Card } from 'antd';
import User from './user';

export default class extends Component {
  render() {
    return (
      <Card>
        <User />
      </Card>
    );
  }
}
