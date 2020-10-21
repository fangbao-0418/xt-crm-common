import React from 'react'

interface Props {
  value: number
  /**  earnings-收益模式 */
  type?: 'earnings' | 'default'
}

class Main extends React.Component<Props> {
  public formatValue () {
    const { value } = this.props
    const str = String(APP.fn.formatMoneyNumber(value, 'm2u'))
    const arr = str.split('.')
    const len = arr[1]?.length || 0
    return arr[0] + '.' + (arr[1] || '') + '0'.repeat(2 - len)
  }
  public render () {
    const { value, type = 'default' } = this.props
    if (type === 'earnings') {
      return (
        <span style={{ color: value >= 0 ? 'green' : 'red' }}>
          {value >= 0 && '+'}{this.formatValue()}
        </span>
      )
    } 
    return this.formatValue()
  }
}
export default Main
