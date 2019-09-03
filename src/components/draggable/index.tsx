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

function Main (props: Props) {
  const data = new Data(props)
  const className = data.wrapClassName
  useEffect(() => {
    const handleMouseDown = data.handleMouseDown.bind(data)
    const handleMouseUp = data.handleMouseUp.bind(data)
    const handleMouseMove = data.handleMouseMove.bind(data)
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