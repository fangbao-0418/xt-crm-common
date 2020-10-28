import React from 'react'

interface Props {
  style?: React.CSSProperties
  className?: string
}

class Main extends React.Component<Props> {
  public render () {
    return (
      <div className={this.props.className} style={{padding: 16, background: '#FFFFFF', ...this.props.style}}>
        {this.props.children}
      </div>
    )
  }
}
export default Main
