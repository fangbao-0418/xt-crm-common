import React from 'react';
import zwtPic from '../../assets/images/zw.png';
// import { getUserList } from '@/pages/order/intercept/user/api';


const onClick = src => () => {
  console.log(src, 'src')
  window.open(src);
};

function getUrl (url) {
  url = /^http/.test(url) ? url : `https://assets.hzxituan.com/${url}`
  return url
}

const Image = (props) => {
  const { className, alt = '图片', style, width, height, ...otherProps } = props
  let src = (props.src || '').trim()
  src = src ? getUrl(src) : zwtPic
  return (
    <img
      className={className}
      onClick={onClick(src)}
      {...otherProps}
      src={src}
      alt={alt}
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
