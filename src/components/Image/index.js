/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-16 17:09:48
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/components/Image/index.js
 */
import React, { useState } from 'react';
import zwtPic from '../../assets/images/zw.png';
import imageMiss from '../../assets/images/image-miss.jpg';
const onClick = src => () => {
  window.open(src);
};

function getUrl (url) {
  url = /^http/.test(url) ? url : `https://assets.hzxituan.com/${url}`
  return url
}

const Image = (props) => {
  const { className, alt = '', style, width, height, ...otherProps } = props
  let sourceSrc = (props.src || '').trim()
  const [src, setSrc] = useState(sourceSrc ? getUrl(sourceSrc) : zwtPic)
  return (
    <img
      className={className}
      onClick={onClick(src)}
      {...otherProps}
      src={src}
      alt={alt}
      onError={() => {
        setSrc(imageMiss)
      }}
      style={{
        width: width || 100,
        height: height || 100,
        cursor: 'pointer',
        ...style,
      }}
    />
  );
};

export default Image;
