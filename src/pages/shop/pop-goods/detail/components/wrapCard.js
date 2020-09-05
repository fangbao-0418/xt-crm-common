import React from 'react';
import { Card } from 'antd';

class WrapCard extends React.Component {
  render() {
    const { data, render } = this.props

    return (
      <div>
        {
          data ? render(data) : <Card loading={!data}>
          </Card>
        }
      </div>

    )
  }
}

export default WrapCard