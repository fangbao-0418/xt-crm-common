import React from 'react'
import Draggable from '../draggable'
import UploadView from '@/components/upload'
import styles from './style.module.styl'
interface Props {
  className?: string
  value?: any[]
  onChange?: (value: any[]) => void
  listNum?: number
  size?: number
  placeholder?: string
  isReadOnly?: boolean
  /**
   * cos: 腾讯云图片
   * oss: 阿里云图片
   * @type {('cos' | 'oss')}
   * @memberof Props
   */
  ossType?: 'cos' | 'oss'
}
class Main extends React.Component<Props> {
  public onChange (value: any[]) {
    if (this.props.onChange) {
      this.props.onChange([...value])
    }
  }
  public render () {
    const { listNum, size, placeholder, className, ossType, isReadOnly } = this.props
    console.log(this.props.value, 'this.props.value')
    return (
      <Draggable
        className={className}
        dragElement='.ant-upload-list-item'
        onMouseUp={(reachIndex, currentIndex) => {
          let value = [...this.props.value]
          const currentValue = value[currentIndex]
          if (reachIndex < currentIndex) {
            value = value.slice(0, reachIndex).concat([currentValue]).concat(value.slice(reachIndex))
            value = value.slice(0, currentIndex + 1).concat(value.slice(currentIndex + 2))
          } else {
            value = value.slice(0, currentIndex).concat(value.slice(currentIndex + 1))
            value = value.slice(0, reachIndex - 1).concat([currentValue]).concat(value.slice(reachIndex - 1))
          }
          this.onChange(value)
        }}
      >
        <UploadView
          extname='png,jpg,jpeg'
          disabled={isReadOnly}
          multiple
          value={this.props.value}
          placeholder={placeholder}
          listType='picture-card'
          listNum={listNum}
          size={size}
          ossType={ossType}
          onChange={(value: any[]) => {
            value = value.slice(0, listNum)
            this.onChange(value)
          }}
        />
      </Draggable>
    )
  }
}

export default Main
