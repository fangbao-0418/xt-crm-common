import React from 'react'
import { Button, Icon } from 'antd'
class Main extends React.Component {
  public state = {
    actText: []
  }
  public handleClickModal = () => {

  }
  public render () {
    return (
      <div className="intf-cat-rebox">
    {this.state.actText.map((val: any, i) => {
      return <div className="intf-cat-reitem" key={i}>{val.title} <span className="close" onClick={() => {
        const actText = this.state.actText;
        actText.splice(i, 1);
        this.setState({ actText })
      }}><Icon type="close" /></span></div>
    })}<Button type="link" onClick={this.handleClickModal}>+添加活动</Button></div>
    )
  }
}

export default Main