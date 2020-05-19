/*
 * @Author: fangbao
 * @Date: 2020-01-19 15:41:45
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-19 23:36:34
 * @FilePath: /xt-crm/src/pages/home/view.js
 */
import React from 'react';
import styles from './login.module.scss';

const homePage = props => {
  console.log(props, 'home props')
  return (
    <div className={styles['home']}>
      <header>
        <h2>欢迎使用喜团管理平台</h2>
      </header>
    </div>
  );
};

export default homePage;
