import React, { PureComponent } from 'react'
import { Avatar } from 'antd';
import PropTypes from 'prop-types'
import styles from './userView.module.scss'

class UserView extends PureComponent {
  render() {
    const { title, desc, children, avatar, onClick } = this.props

    return (
      <div onClick={onClick} className={styles['user-view']}>
        <div className={styles.main}>
          <div className={styles.avatar}>
            {
              avatar ? <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> : <Avatar src={avatar} />
            }
          </div>
          <div className={styles.info}>
            <div>{title}</div>
            {desc && <div className={styles.desc}>{desc}</div>}
          </div>
        </div>
        {children && <div className={styles.content}>{children}</div>}
      </div>
    )
  }
}

UserView.propTypes = {
  title: PropTypes.string,
  desc: PropTypes.string,
  avatar: PropTypes.string,
  onClick: PropTypes.func
}

export default UserView
