import React from 'react';
import { Card } from 'antd';
import Image from '@/components/Image';

class SkuItem extends React.Component {

  render() {
    const { specName, specPicture } = this.props.cont

    return (
      <Card
        bordered
        style={{
          width: 160,
          display: 'inline-block',
          marginRight: 16
        }}
      >
        <div style={{
          textAlign: 'center',
          lineHeight: '24px',
          backgroundColor: '#eee'
        }}>
          { specName }
        </div>
        <Image
          style={{
            marginTop: 8,
            width: 110,
            height: 110,
          }}
          src={specPicture}
        />
      </Card>
    )
  }
}

export default SkuItem