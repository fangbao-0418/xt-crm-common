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
  const { className, alt = '图片', style, ...otherProps } = props
  let src = (props.src || '').trim()
  src = src ? getUrl(src) : zwtPic
  return (
    <img
      className={className}
      {...otherProps}
      src={src}
      alt={alt}
      style={{
        width: 100,
        height: 100,
        cursor: 'pointer',
        ...style,
      }}
      onClick={onClick(src)}
    />
  );
};

export default Image;
