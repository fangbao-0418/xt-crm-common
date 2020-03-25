import React from 'react'
class Main extends React.Component {
  public render () {
    return (
      <div style={{padding: 16, background: '#FFFFFF'}}>
        {this.props.children}
      </div>
    )
  }
}
export default Main
