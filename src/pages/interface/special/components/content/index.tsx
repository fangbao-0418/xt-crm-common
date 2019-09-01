import React from 'react'
import Card from './Card'
import styles from './style.module.sass'
class Main extends React.Component {
  public render () {
    return (
      <div>
        <Card type='shop' title='商品'/>
        <Card type='ad' title='广告'/>
      </div>
    )
  }
}
export default Main