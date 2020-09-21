import React from 'react'

interface Props {
  style?: React.CSSProperties
  children: (cb: any) => React.ReactNode
}

interface State {
  num: number
  /** 0-未开始倒计时 1-开始倒计时 */
  type: 0 | 1
}

class Main extends React.Component<Props, State> {
  public state: State = {
    type: 0,
    num: 59
  }
  public getChildNode () {
    const { children } = this.props
    return children(this.onStart.bind(this))
  }
  public onStart () {
    if (this.state.type === 1) {
      return
    }
    this.setState({
      type: 1
    })
    let num = 59
    let t
    const loop = () => {
      t = setTimeout(() => {
        num--
        if (num <= 0) {
          this.setState({
            type: 0,
            num: 59
          })
          return
        }
        this.setState({
          num
        })
        loop()
      }, 1000)
    }
    loop()
  }
  public render () {
    const { type, num } = this.state
    const { style } = this.props
    return (
      <div style={style}>
        {type === 0 ? this.getChildNode() : (
          <div className='text-center href'>
            {num}s
          </div>
        )}
      </div>
    )
  }
}
export default Main
