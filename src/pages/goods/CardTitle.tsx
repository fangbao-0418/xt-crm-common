import React from 'react';
import { Checkbox } from 'antd';
import If from '@/packages/common/components/if';
interface Props {
  index?: number
  title: React.ReactNode
  checked?: boolean
  onChange?: (e: any) => void
}

function CardTitle({ title, index, checked, onChange}: Props) {
  return (
    <>
      <span>{title}</span>
      <If condition={index === 0}>
        <Checkbox
          style={{ marginLeft: 10 }}
          checked={checked}
          onChange={onChange}
        >
          添加规格图片
        </Checkbox>
        <span>（建议尺寸：200*200，200kb内）</span>
      </If>
    </>
  )
}

export default CardTitle;