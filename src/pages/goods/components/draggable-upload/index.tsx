import React from 'react'
import Draggable from '@/components/draggable';
import UploadView from '@/components/upload';
import styles from './style.module.styl'
interface Props {
  value: any[]
  onChange: (value: any[]) => void
}
class Main extends React.Component<Props> {
  public onChange (value: any[]) {
    if (this.props.onChange) {
      this.props.onChange([...value])
    }
  }
  public render () {
      return (
        <Draggable
          className={styles['goods-draggable']}
          dragElement=".ant-upload-list-item"
          onMouseUp={(reachIndex, currentIndex) => {
            let value = [...this.props.value]
            const currentValue = value[currentIndex]
            if (reachIndex < currentIndex) {
              value = value.slice(0, reachIndex).concat([currentValue]).concat(value.slice(reachIndex))
              value = value.slice(0, currentIndex + 1).concat(value.slice(currentIndex + 2))
            }
            else {
              value = value.slice(0, currentIndex).concat(value.slice(currentIndex + 1))
              value = value.slice(0, reachIndex - 1).concat([currentValue]).concat(value.slice(reachIndex - 1))
            }
            this.onChange(value)
          }}
        >
          <UploadView
            multiple
            value={this.props.value}
            placeholder="上传商品图片"
            listType="picture-card"
            listNum={5}
            size={.3}
            onChange={(value: any[]) => {
              this.onChange(value)
            }}
          />
        </Draggable>
      )
  }
}

export default Main
