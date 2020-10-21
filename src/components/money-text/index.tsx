import React from 'react'

interface Props {
  value: number
  /**  earnings-收益模式 */
  type?: 'earnings' | 'default'
}

class Main extends React.Component<Props> {
  public render () {
    const { value, type } = this.props
    if (type) {
      return APP.fn.formatMoneyNumber(value, 'm2u')
    }
    return (
      <span style={{ color: value >= 0 ? 'green' : 'red' }}>
        {value >= 0 && '+'}{APP.fn.formatMoneyNumber(value, 'm2u')}
      </span>
    )
  }
}
export default Main
