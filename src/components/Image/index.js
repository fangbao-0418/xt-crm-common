import React from 'react';
import zwtPic from '../../assets/images/zw.png';


const onClick = src => () => {
  window.open(src);
};

const replaceHttpUrl = imgUrl => {
  if (imgUrl.indexOf('http') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

const protocol = /https?:\/\//;
let srcUrl = null;

const Image = (props) => {
  const { src='', className, alt = '图片', style, ...otherProps } = props
  let realSrc = src.trim();
  if (!protocol.test(realSrc)) {
    realSrc = `https://assets.hzxituan.com/${realSrc}`;
  }
  srcUrl = src ? replaceHttpUrl(realSrc) : zwtPic;
  return (
    <img
      className={className}
      src={srcUrl}
      alt={alt}
      style={{
        width: 100,
        height: 100,
        cursor: 'pointer',
        ...style,
      }}
      onClick={onClick(srcUrl)}
      {...otherProps}
    />
  );
};

export default Image;
