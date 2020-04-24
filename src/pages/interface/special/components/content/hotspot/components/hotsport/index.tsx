import React, { useRef } from 'react'
import classNames from 'classnames'
import styles from './styles.m.styl'

interface BlockProps {
  x: number
  y: number
}

function Block (props: BlockProps) {
  const elRef = useRef(null)
  const touchRef = useRef({
    isTouch: false,
    gapX: 0,
    gapY: 0
  })
  function onMouseDown (e: any) {
    touchRef.current.isTouch = true
    const { pageX, pageY } = e
    const el = elRef.current as any
    const { x, y } = el.getClientRects()[0]
    touchRef.current.gapX = pageX - x
    touchRef.current.gapY = pageY - y
    console.log(touchRef.current.isTouch, 'block touch')
  }
  function onMouseUp () {
    touchRef.current.isTouch = false
  }
  function onMouseLeave () {
    touchRef.current.isTouch = false
  }
  if (touchRef.current.isTouch) {
    const el: any = elRef.current
    const parentEl = el.parentElement
    const { x, y } = el.getClientRects()[0]
    let top = props.y - touchRef.current.gapY
    let left = props.x - touchRef.current.gapX
    if (top < 0) {
      top = 0
    }
    if (left > parentEl.clientWidth - el.clientWidth) {
      left = parentEl.clientWidth - el.clientWidth
    }
    if (left < 0) {
      left = 0
    }
    if (top > parentEl.clientHeight - el.clientHeight) {
      top = parentEl.clientHeight - el.clientHeight
      console.log(top, 'left left')
    }
    const style = `position:absolute;top:${top}px;left:${left}px`
    el.setAttribute('style', style)
  }
  console.log('render')
  return (
    <div
      ref={elRef}
      className={styles.block}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
    </div>
  )
}

interface Props {
  className?: string
}

interface State {
  x: number
  y: number
}

class Main extends React.Component<Props, State> {
  public state: State = {
    x: 0,
    y: 0
  }
  public isTouch = false
  public onMouseMove = (e: any) => {
    const { pageX, pageY } = e
    const el = this.refs.el as any
    const { x, y } = el.getClientRects()[0]
    if (this.isTouch) {
      this.setState({
        x: pageX - x,
        y: pageY - y
      })
    }
  }
  public render () {
    const { className } = this.props
    const { x, y } = this.state
    return (
      <div
        ref='el'
        className={classNames(styles.hotsport, className)}
        onMouseMove={this.onMouseMove}
        onMouseDown={() => {
          this.isTouch = true
        }}
        onMouseUp={() => {
          this.isTouch = false
        }}
      >
        <Block x={x} y={y} />
        <Block x={x} y={y} />
        <Block x={x} y={y} />
      </div>
    )
  }
}
export default Main
