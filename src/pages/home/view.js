import React from 'react';
import styles from './login.module.scss';

const homePage = props => {
  return (
    <div className={styles['home']}>
      <header>
        <h2>欢迎使用喜团管理平台</h2>
      </header>
    </div>
  );
};

export default homePage;
