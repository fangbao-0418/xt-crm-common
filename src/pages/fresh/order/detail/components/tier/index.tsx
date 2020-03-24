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
    let blockNodes: any[] = []
    let keyIndex = 0
    function loop (arr: T[]) {
      let nodes: any[] = []
      if (arr.length === 0) {
        return
      }
      const childrens: T[][] = []
      if (arr.length < 2) {
        nodes.push(
          <div
            key={`empty-${keyIndex}`}
            className={classNames(styles['tier-item'])}
          >
            <div style={{width: 200}}></div>
          </div>
        )
        nodes.push(
          <div
            key={`line-${keyIndex}`}
            className={classNames(styles['tier-item-line-hidden'], styles['tier-item'], styles['tier-item-line'])}
          >
          </div>
        )
      }
      arr.map((item, index: number) => {
        /** 是否是平推身份 */
        let isInviter = !item.children || item.children && item.children.length === 0
        if (isInviter) {
          isInviter = !item.isBuyer
        }
        if (index === 1) {
          nodes.push(
            <div
              key={'line-' + item.memberId}
              className={classNames(styles['tier-item'], styles['tier-item-line'])}
            >
            </div>
          )
        }
        if (item.children && item.children.length > 0) {
          childrens.push(item.children)
        }
        const name = item.memberNickName || item.memberMobile
        nodes.push(
          <div
            key={item.memberId}
            className={classNames(styles['tier-item'], !isInviter && styles['tier-item-right'])}
          >
            <div className={classNames(styles['tier-label'], item.isCurrentMember && styles['tier-label-current'])}>
              <div title={name}>{name}【{MemberType[item.memberType]}】</div>
              <div>{item.incomeTypeDesc}</div>
            </div>
            <div><div style={!isInviter && item.children && item.children.length > 0 ? undefined : {background: 'transparent'}} className={styles['tier-line']}></div></div>
          </div>
        )
      })
      keyIndex++
      blockNodes.push(
        <div key={keyIndex}>
          <div className={styles.tier}>{nodes}</div>
        </div>
      )
      childrens.map((children) => {
        loop(children)
      })
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
