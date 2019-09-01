import React, { useEffect } from 'react'
import Data from './Data'
interface Event extends React.SyntheticEvent {
  pageX: number
  pageY: number
  movementX: number
  movementY: number
}
export interface Props {
  className?: string
  dragElement: string
  children?: React.ReactChild
}
// class Main extends React.Component<Props> {
//   public pressedEl: any
//   public pressed = false
//   public tempEl: any
//   public constructor (props: Props) {
//     super(props)
//     this.handleMouseDown = this.handleMouseDown.bind(this)
//     this.handleMouseUp = this.handleMouseUp.bind(this)
//     this.handleMouseMove = this.handleMouseMove.bind(this)
//   }
//   public handleMouseDown (e: Event) {
//     e.persist()
//     const target = e.target
//     this.pressedEl = this.getSelectEl(target)
//     this.pressed = true
//     if (this.pressedEl) {
//       this.createTempEl()
//     }
//   }
//   public handleMouseUp () {
//     this.pressed = false
//     console.log('mouse up')
//     if (this.tempEl) {
//       document.body.removeChild(this.tempEl)
//     }
//   }
//   public handleMouseMove (e: Event) {
//     e.persist()
//     if (!this.pressed || !this.pressedEl) {
//       return
//     }
//     const { pageX, pageY } = e
//     const { width, height } = getComputedStyle(this.pressedEl)
//     this.tempEl.style = `position:absolute;left:${pageX}px;top:${pageY}px;width:${width};height:${height}`
//   }
//   public createTempEl () {
//     this.tempEl = document.createElement('div')
//     const { x, y } = this.pressedEl.getBoundingClientRect()
//     const { width, height } = getComputedStyle(this.pressedEl)
//     this.tempEl.draggable = true
//     this.tempEl.style = `position:absolute;left:${x}px;top:${y}px;width:${width};height:${height}`
//     console.log(this.tempEl.style, 'this.tempEl')
//     this.tempEl.appendChild(this.pressedEl.cloneNode(true))
//     document.body.appendChild(this.tempEl)
//   }
//   public getSelectEl (el: any): any {
//     const { type, value } = this.getdragElementInfo()
//     const id = el.id
//     if (typeof el.className !== 'string') {
//       console.warn('draggable element is not a valid element')
//       return
//     }
//     const className = (el.className || '').split(/\s+/)
//     const parentEl = el.parentElement
//     if (id && type === 'id' && id.indexOf(value) > -1) {
//       return el
//     } else if (className && type === 'class' && className.indexOf(value) > -1) {
//       return el
//     } else if (parentEl.nodeName === 'BODY') {
//       console.warn('draggable element not found')
//       return
//     } else {
//       return this.getSelectEl(parentEl)
//     }
//   }
//   public getdragElementInfo () {
//     const { dragElement } = this.props
//     const obj: {type: 'id' | 'class', value: string} = {
//       type: 'id',
//       value: ''
//     }
//     if (/^#/.test(dragElement)) {
//       obj.type = 'id'
//       obj.value = dragElement.replace(/^#/, '')
//     } else if (/^\./.test(dragElement)) {
//       obj.type = 'class'
//       obj.value = dragElement.replace(/^\./, '')
//     }
//     return obj
//   }
//   public render () {
//     return (
//       <div
//         ref="el"
//         onMouseDown={this.handleMouseDown}
//         onMouseUp={this.handleMouseUp}
//         onMouseMove={this.handleMouseMove}
//       >
//         {this.props.children}
//       </div>
//     )
//   }
// }
function Main (props: Props) {
  const className = (props.className || '-draggabled') + '-wrapper'
  const data = new Data(props)
  data.WrapClassName = className
  const handleMouseDown = data.handleMouseDown.bind(data)
  const handleMouseUp = data.handleMouseUp.bind(data)
  const handleMouseMove = data.handleMouseMove.bind(data)
  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  })
  return (
    <div
      className={className}
      style={{
        userSelect: 'none',
        transition: 'all 1000ms'
      }}
    >
      {props.children}
    </div>
  )
}
export default Main