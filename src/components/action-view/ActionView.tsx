import React, { PureComponent, Fragment } from 'react'
import { Divider, Dropdown, Menu, Icon } from 'antd'
import { defaultActionViewProps } from './config/config'

type ActionViewProps = {
  children?: React.ReactNode
} & Partial<typeof defaultActionViewProps>

class ActionView extends PureComponent<ActionViewProps> {
  private static defaultProps = defaultActionViewProps

  render () {
    const { showNum, children, emptyTxt } = this.props

    const childrenLength: number = React.Children.count(children)

    /* 展示数量设置为0 或者 子元素没设置的话 直接返回空值 */
    if (showNum === 0 || childrenLength === 0) {
      return emptyTxt
    }

    /* 展示数量设置大于或者等于子元素设置数量一样的情况下 全部以分割符隔开 */
    if (showNum! >= childrenLength) {
      return React.Children.map(children, (child, i) => {
        return (
          <Fragment key={i}>
            {child}
            {i !== childrenLength - 1 ? <Divider type='vertical' /> : null}
          </Fragment>
        )
      })
    }

    /* 展示数量设置小于子元素设置数量一样的情况下 多余的元素以hover的形式展开 */
    const childrenArray = React.Children.toArray(children)
    const showList = childrenArray.slice(0, showNum)
    const hideList = childrenArray.slice(showNum)

    return (
      <div>
        {React.Children.map(showList, (child, i) => {
          return (
            <Fragment key={i}>
              {child}
              <Divider type='vertical' />
            </Fragment>
          )
        })}
        <Dropdown
          placement='bottomRight'
          overlay={
            <Menu>
              {React.Children.map(hideList, (child, i) => {
                return <Menu.Item key={i}>{child}</Menu.Item>
              })}
            </Menu>
          }
        >
          <a>
            更多 <Icon type='down' />
          </a>
        </Dropdown>
      </div>
    )
  }
}

export default ActionView
