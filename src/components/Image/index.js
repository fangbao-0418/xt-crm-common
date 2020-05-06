/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-06 15:11:10
 * @FilePath: /xt-crm/src/components/Image/index.js
 */
import React, { useState } from 'react'
import zwtPic from '../../assets/images/zw.png'
import imageMiss from '../../assets/images/image-miss.jpg'
import Alert, { AlertComponentProps } from '@/packages/common/components/alert'
import Viewer from 'viewerjs'
const onClick = src => () => {
  window.open(src)
}

function getUrl (url) {
  url = (/^http/).test(url) ? url : ((/^tximg/).test(url) ? `https://sh-tximg.hzxituan.com/${url}` : `https://assets.hzxituan.com/${url}`)
  return url
}

class Image extends React.Component {
  imgRef = undefined
  viewer = undefined
  state = {
    src: this.getSrc()
  }
  componentWillReceiveProps (props) {
    this.setState({
      src: this.getSrc(props)
    })
  }
  handleView (src) {
    if (!this.viewer) {
      this.viewer = new Viewer(this.imgRef, {
        navbar: false,
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
          width: width || 100,
          height: height || 100,
          cursor: 'pointer',
          ...style,
        }}
      />
    )
  }
}

// const Image = (props) => {
//   const { className, alt = '', style, width, height, ...otherProps } = props
//   const sourceSrc = (props.src || '').trim()
//   const finalSrc = (sourceSrc ? getUrl(sourceSrc) : zwtPic)
//   const [src, setSrc] = useState(finalSrc)
//   console.log(useState(finalSrc)[0], 'src')
//   // return null
//   return (
//     <img
//       className={className}
//       onClick={onClick(src)}
//       // {...otherProps}
//       src={`${src}`}
//       alt={alt}
//       onError={() => {
//         console.log('error')
//         setSrc(imageMiss)
//       }}
//       style={{
//         width: width || 100,
//         height: height || 100,
//         cursor: 'pointer',
//         ...style,
//       }}
//     />
//   );
// };

export default Alert(Image)
