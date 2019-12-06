import * as redux from 'react-redux';
import { dispatch } from '@rematch/core';
import { createHashHistory } from 'history';
import { baseHost } from './baseHost';
import { Decimal } from 'decimal.js';
import { ExpressCompanyOptions } from '@/config';
import * as LocalStorage from '@/util/localstorage';
import moment from 'moment';
import { isNil } from 'lodash';
import { handleApiUrl } from './app/config';
const pathToRegexp = require('path-to-regexp');
const History = createHashHistory();

function defaultMapStateToProps() {
  return { dispatch, history: History };
}

// 包装redux.connect, 默认引入dispatch函数和history对象
export function connect(mapStateToProps) {
  mapStateToProps = mapStateToProps || defaultMapStateToProps;
  return redux.connect(state => {
    const base = mapStateToProps(state);
    return { ...base, dispatch, history: History };
  });
}

/**
 * 转换query字符串为json格式
 */
export function parseQuery() {
  const search = window.location.hash.split('?')[1] || '';
  const reslover = new URLSearchParams(search);
  const obj = reslover.entries();
  const results = {};
  for (const item of obj) {
    const [key, value] = item;
    value && (results[key] = value);
  }
  return results;
}

/** query序列化 */
export function queryString(obj) {
  if (typeof obj !== 'object') return '';
  let pairs = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      pairs.push(`${key}=${obj[key]}`);
    }
  }
  return pairs.length > 0 ? `?${pairs.join('&')}` : '';
}

/**
 * 设置路径上的query参数
 * @param {*} params
 * @param {*} force
 */
export function setQuery(params = {}, force = false) {
  console.log(params, 'params1');
  console.log(window.location.hash, 'hash');
  const str = decodeURIComponent(window.location.hash); // 对中文解码
  const [baseLoc, baseQueryStr = ''] = str.split('?');
  const baseQuery = {};
  !force &&
    baseQueryStr &&
    baseQueryStr.split('&').forEach(item => {
      const [key, value] = item.split('=');
      baseQuery[key] = value;
    });
  const filters = {};
  for (const k in params) {
    if (Object.prototype.hasOwnProperty.call(params, k)) {
      filters[k] = params[k] === 0 ? 0 : params[k] || '';
    }
  }
  console.log(baseQuery, 'baseQuery');
  const reslover = new URLSearchParams({ ...baseQuery, ...filters });
  const search = reslover.toString();
  window.location.hash = `${baseLoc}?${search}`;
}

export function saveDefault(state, payload) {
  return {
    ...state,
    ...payload
  };
}

export function arrToTree(list = [], pid = null, key = 'parentId') {
  let tree = [];
  Array.isArray(list) &&
    list.forEach(item => {
      let tmp = deepClone(item);
      if (item[key] === pid) {
        tmp['subMenus'] = arrToTree(list, item.id, key);
        tree.push(tmp);
      }
    });
  return tree;
}

export function deepClone(obj) {
  let str = '';
  let newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== 'object') {
    return;
  } else if (window.JSON) {
    str = JSON.stringify(obj); // 系列化对象
    newobj = JSON.parse(str); // 还原
  } else {
    for (var i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
    }
  }
  return newobj;
}

export function getPidById(arr = [], id, key = 'parentId') {
  const item = arr.find(item => item.id === id) || {};
  return item[key];
}

export function getItemById(arr = [], id) {
  return arr.find(item => item.id === id) || [];
}

export function getAllId(base = [], list = [], key = 'parentId') {
  let tree = [];
  list.forEach(id => {
    tree.push(id);
    let pid = getPidById(base, id, key);
    while (pid) {
      tree.push(pid);
      pid = getPidById(base, pid, key);
    }
  });
  return tree;
}

export const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export function firstLetterToUpperCase(str = '') {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

export function gotoPage(path, query) {
  // const str = decodeURIComponent(window.location.hash); // 对中文解码
  // const [_, baseQueryStr = ''] = str.split('?');
  query = Object.assign(parseQuery(), query);
  const pairs = [];
  for (let key in query) {
    pairs.push(key + '=' + query[key]);
  }
  const search = pairs.length > 0 ? `?${pairs.join('&')}` : '';
  History.push(`${path}${search}`);
}

// 拼接日志信息
export function formatData(data) {
  let str = '',
    q = '';
  for (let i in data) {
    q = data[i];
    if (typeof data[i] === 'object') q = JSON.stringify(data[i]);
    if (q) str += '&' + i + '=' + encodeURIComponent(q);
  }
  return str.substr(1);
}

export function initImgList(imgUrlWap, uid) {
  if (imgUrlWap) {
    if (imgUrlWap.indexOf('http') !== 0) {
      imgUrlWap = 'https://assets.hzxituan.com/' + imgUrlWap;
    }
    return [
      {
        uid: uid || String(Math.random()).slice(2),
        url: imgUrlWap,
        status: 'done',
        thumbUrl: imgUrlWap,
        name: imgUrlWap
      }
    ];
  }
  return [];
}

export function getHeaders(headers) {
  const token = LocalStorage.get('token');
  if (token) headers.Authorization = token;
  return headers;
}

export const prefix = url => {
  url = handleApiUrl(url);
  let apiDomain = baseHost;
  if (!(process.env.PUB_ENV == 'pre' || process.env.PUB_ENV == 'prod')) {
    if (!(process.env.PUB_ENV == 'test' || process.env.PUB_ENV == 'dev')) {
      const mockConfig = require('../mock.json');
      if (typeof mockConfig == 'object' && mockConfig['apiList'] instanceof Array) {
        console.log(url, mockConfig, '-------------');
        const isMock = mockConfig['apiList'].find(item => {
          const path = item.replace(/{/g, ':').replace(/}/g, '');
          return pathToRegexp(path).test(url);
        });
        if (isMock) {
          console.log(url);
          return `/mock${url}`;
        } else {
          apiDomain = LocalStorage.get('apidomain') || baseHost;
        }
      } else {
        apiDomain = LocalStorage.get('apidomain') || baseHost;
      }
    } else {
      apiDomain = LocalStorage.get('apidomain') || baseHost;
    }
  }
  return /https?/.test(url) ? url : `${apiDomain}${url}`;
};

/**
 *
 * @param { 目标数组 } target
 * @param { 需要比较的数组 } source
 */
export function unionArray(target, source) {
  const result = [...target];
  for (let item of source) {
    if (!result.some(v => v.id === item.id)) {
      result.push(item);
    }
  }
  return result;
}

/** 检测imgUrl是否带域名，没有则加上*/
export function replaceHttpUrl(imgUrl = '') {
  if (imgUrl.indexOf('https') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

/** 检测imgUrl是否带域名，有则清除 */
export function removeURLDomain(imgUrl = '') {
  return imgUrl.replace(/https:\/\/assets.hzxituan.com\//g, '');
}
/**
 * @description 去掉多余的属性
 * @param {需要过滤的对象} obj
 * @param {对于的属性名称} prop
 */
export function dissoc(obj, prop) {
  let result = {};
  for (let p in obj) {
    if (p !== prop) {
      result[p] = obj[p];
    }
  }
  return result;
}

export function mul(unitPrice, serverNum) {
  if (unitPrice && serverNum) {
    return new Decimal(unitPrice).mul(serverNum).toNumber();
  }
  return 0;
}

export function getExpressCode(name) {
  for (let key in ExpressCompanyOptions) {
    if (ExpressCompanyOptions[key] === name) {
      return key;
    }
  }
}

export function momentRangeValueof(values = []) {
  return values.map(v => moment(v).valueOf());
}

export function mapTree(org) {
  const haveChildren = Array.isArray(org.childList) && org.childList.length > 0;
  return {
    label: org.name,
    value: org.id,
    data: { ...org },
    children: haveChildren ? org.childList.map(i => mapTree(i)) : []
  };
}

export const formatMoneyBeforeRequest = price => {
  if (isNil(price)) {
    return price;
  }

  const pasred = parseFloat(price);
  if (isNaN(pasred)) {
    return undefined;
  }

  return (pasred * 100).toFixed();
};

export function treeToarr(list = [], arr) {
  const results = arr || [];
  for (const item of list) {
    results.push(item);
    if (Array.isArray(item.childList)) {
      treeToarr(item.childList, results);
    }
  }
  return results;
}

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */
function getBlob(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };

    xhr.send();
  });
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    const body = document.querySelector('body');

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // fix Firefox
    link.style.display = 'none';
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  }
}

/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
export function download(url, filename) {
  getBlob(url).then(blob => {
    saveAs(blob, filename);
  });
}

//唯一key
export function uuid() {
  var s = [];
  var hexDigits = '0123456789abcdef';

  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');

  return uuid + '-' + new Date().getTime();
}

//加法精确计算
export function accAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}
//减法精确计算
export function Subtr(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //last modify by deeka
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2;
  return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}
//乘法精确计算
export function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split('.')[1].length;
  } catch (e) {}
  try {
    m += s2.split('.')[1].length;
  } catch (e) {}
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}
//除法精确计算
export function accDiv(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {}

  r1 = Number(arg1.toString().replace('.', ''));

  r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}
