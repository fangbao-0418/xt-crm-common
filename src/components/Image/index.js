/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-30 00:57:45
 * @FilePath: /eslint-plugin-xt-react/Users/fb/Documents/xituan/xt-crm/src/components/Image/index.js
 */
import React, { useState } from 'react'
import zwtPic from '../../assets/images/zw.png'
import imageMiss from '../../assets/images/image-miss.jpg'
const onClick = src => () => {
  window.open(src)
}

function getUrl (url) {
  url = APP.fn.fillOssDomainUrl(url)
  return url
}

class Image extends React.Component {
  state = {
    src: this.getSrc()
  }
  componentWillReceiveProps (props) {
    this.setState({
      src: this.getSrc(props)
    })
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
        className={className}
        onClick={onClick(src)}
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

export default Image
