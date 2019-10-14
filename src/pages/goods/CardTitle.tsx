import React from 'react';
import { Checkbox } from 'antd';

function CardTitle(props: any) {
  return (
    <>
      <span>{props.title}</span>
      {props.index === 0 && (
        <>
          <Checkbox className="ml10" onChange={props.onChange}>添加规格图片</Checkbox>
          <span>（建议尺寸：200*200，200kb内）</span>
        </>
      )}
    </>
  )
}

export default CardTitle;