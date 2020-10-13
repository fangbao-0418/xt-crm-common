import React from 'react'
import classNames from 'classnames'
import styles from './styles.module.styl'

interface MemberSnapshot {
  inviter: MemberSnapshot,
  memberId: number,
  nickName: string,
  parent: MemberSnapshot,
  phone: number,
  popActivateType: number,
  popMemberTypeDesc: string,
  remark: string
}

interface Props {
  dataSource: MemberSnapshot
}
class Main extends React.Component<Props, {}> {
  public getNodes () {
    const dataSource = this.props.dataSource || {}
    let blockNodes: any[] = []
    let keyIndex = 0

    function loop (node: MemberSnapshot) {
      let nodes: any[] = []
      // 是否平推身份
      const inviter = node.inviter
      const isInviter = !!inviter
      nodes.push(
        <div key={node.memberId} className={classNames(styles['tier-item'])}>
          <div className={styles['tier-label']}>
            <div title={node.nickName}>{node.nickName}【{node.popMemberTypeDesc}】</div>
            <div>{node.remark}</div>
          </div>
          <div className={styles['tier-line-box']}>
            <div style={keyIndex > 0 ? undefined : {background: 'transparent'}} className={styles['tier-line']}></div>
          </div>
        </div>
      )
      if (isInviter) {
        nodes.push(
          <div className={styles['tier-right-line']}></div>
        )
        nodes.push(
          <div key={inviter.memberId} className={styles['tier-item']}>
            <div className={styles['tier-label']}>
              <div title={inviter.nickName}>{inviter.nickName}【{inviter.popMemberTypeDesc}】</div>
              <div>{inviter.remark}</div>
            </div>
          </div>
        )
      }
      keyIndex++
      blockNodes.unshift(
        <div key={keyIndex}>
          <div className={styles.tier}>{nodes}</div>
        </div>
      )
      if (node.parent) {
        loop(node.parent)
      }
      
    }
    loop(dataSource)
    return blockNodes
  }
  public render () {
    return (
      <div>
        <div style={{width: 400, margin: '0 auto'}}>
          {this.getNodes()}
        </div>
      </div>
    )
  }
}

export default Main