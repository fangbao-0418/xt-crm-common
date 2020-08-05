/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-07 10:19:49
 * @FilePath: /xt-crm/src/components/Image/index.js
 */
import React from 'react'
import zwtPic from '@/assets/images/zw.png'
import imageMiss from '@/assets/images/image-miss.jpg'
import Viewer from 'viewerjs'

interface Props {
  className?: string
  alt?: string
  style?: React.CSSProperties
  width?: number
  height?: number
  src: string
}

function getUrl (url: string) {
  url = APP.fn.fillOssDomainUrl(url)
  return url
}

class Image extends React.Component<Props> {
  imgRef: any = undefined
  viewer: any = undefined
  state = {
    src: this.getSrc()
  }
  componentWillReceiveProps (props: Props) {
    this.setState({
      src: this.getSrc(props)
    })
  }
  handleView () {
    if (!this.viewer) {
      this.viewer = new Viewer(this.imgRef, {
        navbar: false,
        title: [4, (image: any, imageData: any) => `${image.alt}`],
        hidden: () => {
          this.viewer.destroy()
          this.viewer = undefined
        }
      })
      this.viewer.show()
    }
  }
  getSrc (props = this.props) {
    const { className, alt = '', style, width, height, ...otherProps } = props
    const sourceSrc = (props.src || '').trim()
    const src = (sourceSrc ? getUrl(sourceSrc) : zwtPic)
    return src
  }
  render () {
    const { className, alt = '', style, width, height, ...otherProps } = this.props
    const { src } = this.state
    return (
      <img
        ref={(ref) => this.imgRef = ref }
        className={className}
        onClick={this.handleView.bind(this, src)}
        {...otherProps}
        src={src}
        alt={alt}
        onError={() => {
          console.log('error')
          this.setState({
            src: imageMiss
          })
        }}
        style={{
          display: 'none',
          width: width || 100,
          height: height || 100,
          cursor: 'pointer',
          ...style,
        }}
      />
    )
  }
}

export default Image
