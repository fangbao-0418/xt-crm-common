import React from 'react'
import classNames from 'classnames'
import { MemberSnapshot } from '../../interface'
import styles from './styles.module.styl'

export enum MemberType {
  普 = 0,
  团 = 10,
  区 = 20,
  合 = 30,
  管 = 40
}

type T = (MemberSnapshot & {children: T[]})

interface Props {
  dataSource: T[]
}
class Main extends React.Component<Props> {
  public getNodes () {
    const dataSource = this.props.dataSource || []
    function loop (arr: T[]) {
      let nodes: any[] = []
      arr.map((item, index: number) => {
        /** 是否是平推身份 */
        let isInviter = !item.children || (item.children && item.children.length === 0)
        if (index === 1) {
          nodes.push(
            <div
              className={classNames(styles['tier-item'], styles['tier-item-line'])}
            >
            </div>
          )
        }
        nodes.push(
          <div
            className={classNames(styles['tier-item'], !isInviter && styles['tier-item-right'])}
          >
            <div className={classNames(styles['tier-label'], item.isCurrentMember && styles['tier-label-current'])}>
              <div>{item.memberNickName || item.memberMobile}【{MemberType[item.memberType]}】</div>
              <div>{item.incomeTypeDesc}</div>
            </div>
            <div><div style={!isInviter ? undefined : {background: 'transparent'}} className={styles['tier-line']}></div></div>
            {item.children && loop(item.children)}
          </div>
        )
      })
      return (
        <div>
          <div className={styles.tier}>{nodes}</div>
        </div>
      )
    }
    const node = loop(dataSource)
    return node
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
