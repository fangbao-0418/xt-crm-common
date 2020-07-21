import React from 'react'
import { Icon } from 'antd'
interface Props {
  className?: string
  style?: React.CSSProperties
}
class Main extends React.Component<Props> {
  public render () {
    const { className, style } = this.props
    return (
      <div
        className={className}
        style={{
          position: 'relative',
          ...style
        }}
      >
        <div
          style={{
            left: 0,
            top: 0,
            position: 'absolute'
          }}
        >
          <Icon
            style={{
              color: '#1890ff',
            }}
            type='info-circle'
            theme='filled'
          />
        </div>
        <div
          style={{
            // float: 'left'
            marginLeft: 20
          }}
        >
          {this.props.children}
        </div>
      </div>
    )
  }
}
export default Main
