import React from 'react'
import styles from './style.module.sass'
class Main extends React.Component {
  public render () {
    return (
      <div
        onMouseOver={() => {
          console.log('over')
        }}
        className={styles.product}
      >
        <img
          src="https://assets.hzxituan.com/crm/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551566900905049.jpg?x-oss-process=style/p_150"
        />
        <span>美颜秘笈六胜肽冻干粉</span>
      </div>
    )
  }
}
export default Main