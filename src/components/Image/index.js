import React from 'react';

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
const Image = (props) => {
  const { src, className, alt = '图片', style, ...otherProps } = props
  let realSrc = src;
  if (!protocol.test(src)) {
    realSrc = 'https://assets.hzxituan.com/' + src;
  }

  return (
    src ? (
    <img
      className={className}
      src={replaceHttpUrl(realSrc)}
      alt={alt}
      style={{
        width: 100,
        height: 100,
        cursor: 'pointer',
        ...style,
      }}
      onClick={onClick(realSrc)}
      {...otherProps}
    />) : null
  );
};

export default Image;
