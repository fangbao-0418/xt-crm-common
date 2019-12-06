import React from 'react';
import { Spin } from 'antd';
import styles from './loader.module.scss';

const loader = () => {
  return (
    <div hidden className={styles['loader-wrapper']}>
      <div className={styles['loader-content']}>
        <Spin tip="加载中..." />
      </div>
    </div>
  );
};

export default loader;
