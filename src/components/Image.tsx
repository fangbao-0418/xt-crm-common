import React from 'react'
import { Modal } from 'antd'
interface Props {
  className?: string
  style?: React.CSSProperties
  src?: any
  alt?: string
  title?: string
}
interface State {
  show: boolean
  visible: boolean
}
class Main extends React.Component<Props, State> {
  public state: State = {
    show: false,
    visible: false
  }
  public render () {
    const src = this.props.src || require('@/assets/images/zw.png')
    const { title, alt, className, style } = this.props
    const { visible, show } = this.state
    return (
      <React.Fragment>
        <img
          onClick={() => {
            this.setState({
              show: true,
              visible: true
            })
          }}
          style={style}
          className={className}
          title={title}
          alt={alt}
          src={src}
        />
        { show && (
            <Modal
              width='60%'
              visible={visible}
              footer={null}
              title={null}
              onCancel={() => {
                this.setState({
                  visible: false
                })
              }}
              afterClose={() => {
                this.setState({
                  show: false
                })
              }}
            >
              <div
                style={{
                  textAlign: 'center'
                }}
              >
              <img
                // style={style}
                style={{
                  maxWidth: '100%'
                }}
                className={className}
                title={title}
                alt={alt}
                src={src}
              />
              </div>
            </Modal>
          )
        }
      </React.Fragment>
    )
  }
}
export default Main
