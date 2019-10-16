import React from 'react';
import { Checkbox } from 'antd';

interface Props extends React.Props<{}> {
  index?: number
  title: React.ReactNode
  checked?: boolean
  onChange?: (e: any) => void
}

function CardTitle(props: Props) {
  return (
    <>
      <span>{props.title}</span>
      {props.index === 0 && (
        <>
          <Checkbox
            checked={props.checked}
            className="ml10"
            onChange={props.onChange}
          >
            添加规格图片
          </Checkbox>
          <span>（建议尺寸：200*200，200kb内）</span>
        </>
      )}
    </>
  )
}

export default CardTitle;