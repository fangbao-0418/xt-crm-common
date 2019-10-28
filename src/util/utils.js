import * as redux from 'react-redux';
import { dispatch } from '@rematch/core';
import { createHashHistory } from 'history';
import { baseHost } from './baseHost';
import { isNil } from 'lodash';
import { Decimal } from 'decimal.js';
import { ExpressCompanyOptions } from '@/config';
import * as LocalStorage from '@/util/localstorage';

const pathToRegexp = require('path-to-regexp');
const History = createHashHistory();

function defaultMapStateToProps() {
  return { dispatch, history: History };
}

// 包装redux.connect, 默认引入dispatch函数和history对象
export function connect(mapStateToProps = defaultMapStateToProps) {
  return redux.connect(state => {
    const base = mapStateToProps(state);
    return { ...base, dispatch, history: History }
  });
}


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

export function setQuery(params = {}, force = false) {
  const str = decodeURIComponent(window.location.hash); // 对中文解码
  const [baseLoc, baseQueryStr = ''] = str.split('?');
  const baseQuery = {};
  !force && baseQueryStr && baseQueryStr.split('&').forEach(item => {
    const [key, value] = item.split('=');
    baseQuery[key] = value;
  });
  const filters = {};
  for (const k in params) {
    if (Object.prototype.hasOwnProperty.call(params, k)) {
      filters[k] = params[k] || '';
    }
  }
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
  Array.isArray(list) && list.forEach(item => {
    let tmp = deepClone(item);
    if (item[key] === pid) {
      tmp['subMenus'] = arrToTree(list, item.id, key);
      tree.push(tmp);
    }
  });
  return tree;
};

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
};

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
    tree.push(id)
    let pid = getPidById(base, id, key)
    while (pid) {
      tree.push(pid)
      pid = getPidById(base, pid, key)
    }
  });
  return tree;
}

export const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export function firstLetterToUpperCase(str = '') {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

export function gotoPage(path) {
  const str = decodeURIComponent(window.location.hash); // 对中文解码
  const [_, baseQueryStr = ''] = str.split('?');
  History.push(`${path}?${baseQueryStr}`);
}

// 拼接日志信息
export function formatData(data) {
  let str = '', q = '';
  for (let i in data) {
    q = data[i];
    if (typeof data[i] === 'object') q = JSON.stringify(data[i])
    if (q) str += '&' + i + '=' + encodeURIComponent(q)
  }
  return str.substr(1)
}

export function initImgList(imgUrlWap, uid) {
  if (imgUrlWap) {
    if (imgUrlWap.indexOf('http') !== 0) {
      imgUrlWap = 'https://assets.hzxituan.com/' + imgUrlWap;
    }
    return [
      {
        uid: uid || `${-parseInt(Math.random() * 1000)}`,
        url: imgUrlWap,
        status: 'done',
        thumbUrl: imgUrlWap,
        name: imgUrlWap,
      },
    ];
  }
  return [];
};

export function getHeaders(headers) {
  const token = LocalStorage.get('token');
  if (token) headers.Authorization = token;
  return headers;
}

export const prefix = url => {
  let apiDomain = baseHost;
  if (!(process.env.PUB_ENV == 'pre' || process.env.PUB_ENV == 'prod')) {
    if (!(process.env.PUB_ENV == 'test' || process.env.PUB_ENV == 'dev')) {
      const mockConfig = require('../mock.json');
      if (
        typeof mockConfig == 'object' &&
        mockConfig['apiList'] instanceof Array
      ) {
        const isMock = mockConfig['apiList'].find((item) => {
          const path = item.replace(/{/g, ':').replace(/}/g, '');
          return pathToRegexp(path).test(url);
        })
        if (isMock) {
          console.log(url);
          return `/mock/${url}`;
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
export function replaceHttpUrl(imgUrl = '') {
  if (imgUrl.indexOf('https') !== 0) {
    imgUrl = 'https://assets.hzxituan.com/' + imgUrl;
  }
  return imgUrl;
}

export function mapTree(org) {
  const haveChildren = Array.isArray(org.childList) && org.childList.length > 0;
  return {
    label: org.name,
    value: org.id,
    data: { ...org },
    children: haveChildren ? org.childList.map(i => mapTree(i)) : []
  };
};

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
      treeToarr(item.childList, results)
    }
  }
  return results;
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
    return new Decimal(unitPrice).mul(serverNum).toNumber()
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