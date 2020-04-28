import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import UploadView from '@/components/upload';
import styles from '../style.module.scss'
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
function SkuUploadItem (props: Props) {
  function onChange (value: ValueProps) {
    if (props.onChange) {
      props.onChange(value)
    }
  }

  function removePrefixOfUrl (url: string) {
    url = APP.fn.deleteOssDomainUrl(url)
    return url
  }
  const [value, setValue] = useState(Object.assign({}, props.value))
  const { specName, specPicture } = Object.assign({}, props.value)
  useEffect(() => {
    // console.log(props.value, 'value')
    setValue(Object.assign({}, props.value))
  }, [specName, specPicture])
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
          value={value.specPicture ? [{
            uid: 1,
            url: value.specPicture
          }] : undefined}
          onChange={(val: any) => {
            const newValue = {
              ...value,
              specPicture: removePrefixOfUrl(val[0] && val[0].url)
            }
            console.log('newValue', newValue, val)
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