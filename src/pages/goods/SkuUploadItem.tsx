import React from 'react';
import { Input } from 'antd';
import UploadView from '../../components/upload';
import styles from './edit.module.scss';
function SkuUploadItem(props: any) {
  return (
    <div className={styles.spuitem}>
      <Input
        placeholder="请设置规格名称"
        value={props.value}
        onChange={(e: any) => props.onChangeSpuName(e.target.value)}
        disabled={props.disabled}
      />
      {props.index === 0 && props.showImage &&
        <UploadView
          value={props.spuPicture}
          onChange={props.onChangeSpuPicture}
          className={styles["sku-upload"]}
          listType="picture-card"
          size={0.2}
        />}
      {props.children}
    </div>
  );
}
export default SkuUploadItem;