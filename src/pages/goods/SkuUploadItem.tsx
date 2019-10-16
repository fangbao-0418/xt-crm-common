import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import UploadView from '../../components/upload';
import styles from './edit.module.scss'
interface ValueProps {
  specPicture?: string
  specName: string
}
interface Props extends React.Props<{}> {
  onChange?: (value: ValueProps) => void
  value?: ValueProps
  disabled?: boolean
  index?: number
  showImage?: boolean
}
function SkuUploadItem(props: Props) {
  function onChange (value: ValueProps) {
    if (props.onChange) {
      props.onChange(value)
    }
  }
  const [value, setValue] = useState(Object.assign({}, props.value))
  useEffect(() => {
    setValue(Object.assign({}, props.value))
  }, [props.value])
  return (
    <div className={styles.spuitem}>
      <Input
        placeholder="请设置规格名称"
        value={value.specName}
        onChange={(e: any) => {
          const newValue = {
            ...value,
            specName: e.target.value
          }
          onChange(newValue)
          setValue(newValue)
        }}
        disabled={props.disabled}
      />
      {props.showImage &&
        <UploadView
          // disabled={props.disabled}
          value={value.specPicture && [{
            uid: 1,
            url: value.specPicture
          }]}
          onChange={(val: any) => {
            console.log(val, 'val')
            const newValue = {
              ...value,
              specPicture: val[0] && val[0].url
            }
            console.log(newValue, 'val')
            onChange(newValue)
            setValue(newValue)
          }}
          className={styles["sku-upload"]}
          listType="picture-card"
          size={0.2}
        />}
      {props.children}
    </div>
  );
}
export default SkuUploadItem;