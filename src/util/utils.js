import * as redux from 'react-redux';
import { dispatch } from '@rematch/core';
import { createHashHistory } from 'history';
import { baseHost } from './baseHost';
import { Decimal } from 'decimal.js';
import { ExpressCompanyOptions } from '@/config';
import * as LocalStorage from '@/util/localstorage';
import moment from 'moment';
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

export function initImgList(imgUrlWap) {
  if (imgUrlWap) {
    if (imgUrlWap.indexOf('http') !== 0) {
      imgUrlWap = 'https://assets.hzxituan.com/' + imgUrlWap;
    }
    return [
      {
        uid: `${-parseInt(Math.random() * 1000)}`,
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
  if (!(process.env.PUB_ENV == 'prod' || process.env.PUB_ENV == 'pre')) apiDomain = LocalStorage.get('apidomain') || baseHost;
  return `${apiDomain}${url}`;
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

export function momentRangeValueof(values = []) {
  return values.map(v => moment(v).valueOf())
}