import React, { useRef, useState, useEffect } from 'react'
import classNames from 'classnames'
import styles from './styles.m.styl'

interface BlockProps {
  x: number
  y: number
  isTouch: boolean
}

function Block (props: BlockProps) {
  const elRef = useRef(null)
  const [active, setActive] = useState(false)
  const touchRef = useRef({
    isTouch: false,
    isSpanTouch: false,
    gapX: 0,
    gapY: 0,
    offsetLeft: 0,
    offsetTop: 0,
    initWidth: 0,
    initHeight: 0,
    spanCurrentIndex: 0
  })
  if (!props.isTouch) {
    touchRef.current.isTouch = false
    touchRef.current.isSpanTouch = false
  }
  function onMouseDown (e: any) {
    if (touchRef.current.isSpanTouch) {
      return
    }
    touchRef.current.isTouch = true
    const { pageX, pageY } = e
    const el = elRef.current as any
    const { x, y } = el.getClientRects()[0]
    touchRef.current.gapX = pageX - x
    touchRef.current.gapY = pageY - y
    touchRef.current.initWidth = el.clientWidth
    touchRef.current.initHeight = el.clientHeight
    touchRef.current.offsetLeft = el.offsetLeft
    touchRef.current.offsetTop = el.offsetTop
  }
  function onMouseUp () {
    touchRef.current.isTouch = false
  }
  function onMouseLeave () {
    setActive(false)
  }
  function onMouseEnter () {
    const el = elRef.current
    setActive(true)
  }
  if (touchRef.current.isTouch) {
    // console.log('if 1')
    const el: any = elRef.current
    const parentEl = el.parentElement
    const { x, y } = el.getClientRects()[0]
    let top = props.y + touchRef.current.offsetTop
    let left = props.x + touchRef.current.offsetLeft
    const width = touchRef.current.initWidth
    const height = touchRef.current.initHeight
    if (top < 0) {
      top = 0
    }
    if (top > parentEl.clientHeight - el.clientHeight) {
      top = parentEl.clientHeight - el.clientHeight
    }
    if (left > parentEl.clientWidth - el.clientWidth) {
      left = parentEl.clientWidth - el.clientWidth
    }
    if (left < 0) {
      left = 0
    }
    const style = `position:absolute;top:${top}px;left:${left}px;width:${width}px;height:${height}px;`
    el.setAttribute('style', style)
  }
  if (touchRef.current.isSpanTouch) {
    // console.log('if 2')
    const spanCurrentIndex = touchRef.current.spanCurrentIndex
    const el: any = elRef.current
    const parentEl = el.parentElement
    let top = el.offsetTop
    let left = el.offsetLeft
    let width = touchRef.current.initWidth + props.x
    let height =touchRef.current.initHeight + props.y
    if ([0, 1, 3].indexOf(spanCurrentIndex) > -1) {
      top = touchRef.current.offsetTop + props.y
      left = touchRef.current.offsetLeft + props.x
      width = touchRef.current.initWidth - props.x
      height = touchRef.current.initHeight - props.y
    } else if ([2].indexOf(spanCurrentIndex) > -1) {
      top = touchRef.current.offsetTop + props.y
      width = touchRef.current.initWidth + props.x
      height = touchRef.current.initHeight - props.y
    } else if ([5].indexOf(spanCurrentIndex) > -1) {
      // 上、右不动
      left = touchRef.current.offsetLeft + props.x
      width = touchRef.current.initWidth - props.x
      height = touchRef.current.initHeight + props.y
    }
    width = width <= 2 ? 2 : width
    height = height <= 2 ? 2 : height
    if (top < 0) {
      top = 0
    }
    if (top > parentEl.clientHeight - el.clientHeight) {
      top = parentEl.clientHeight - el.clientHeight
    }
    if (left > parentEl.clientWidth - el.clientWidth) {
      left = parentEl.clientWidth - el.clientWidth
    }
    if (left < 0) {
      left = 0
    }
    const style = `position:absolute;top:${top}px;left:${left}px;width:${width}px;height:${height}px`
    el.setAttribute('style', style)
  }
  const children = [0, 1, 2, 3, 4, 5, 6, 7]
  return (
    <div
      ref={elRef}
      className={classNames(styles.block, { [styles.active]: active })}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      {
        children.map((v, k) => {
          return (
            <span
              key={k}
              onMouseDown={(e) => {
                const el = elRef.current as any
                touchRef.current.isSpanTouch = true
                touchRef.current.initWidth = el.clientWidth
                touchRef.current.initHeight = el.clientHeight
                touchRef.current.spanCurrentIndex = k
                touchRef.current.offsetLeft = el.offsetLeft
                touchRef.current.offsetTop = el.offsetTop
                // console.log('down 3')
              }}
            />
          )
        })
      }
    </div>
  )
}

interface Props {
  className?: string
}

interface State {
  x: number
  y: number
  isTouch: boolean
}

class Main extends React.Component<Props, State> {
  public state: State = {
    x: 0,
    y: 0,
    isTouch: false
  }
  public isTouch = false
  public initPageX = 0
  public initPyageY= 0
  public onMouseMove = (e: any) => {
    const { pageX, pageY } = e
    const el = this.refs.el as any
    const { x, y } = el.getClientRects()[0]
    if (this.isTouch) {
      // console.log(this.isTouch, 'mv 1')
      this.setState({
        x: pageX - this.initPageX,
        y: pageY - this.initPyageY
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
        onMouseDown={(e) => {
          const { pageX, pageY } = e
          this.initPageX = pageX
          this.initPyageY = pageY
          this.isTouch = true
          this.setState({
            x: 0,
            y: 0
          })
          this.forceUpdate()
          // console.log('down top')
        }}
        onMouseUp={() => {
          this.isTouch = false
          this.forceUpdate()
        }}
        onMouseLeave={() => {
          console.log('leave')
          this.isTouch = false
          this.forceUpdate()
        }}
      >
        <Block isTouch={this.isTouch} x={x} y={y} />
        <Block isTouch={this.isTouch} x={x} y={y} />
        <Block isTouch={this.isTouch} x={x} y={y} />
      </div>
    )
  }
}
export default Main
