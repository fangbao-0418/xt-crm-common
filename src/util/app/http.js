import {
  message
} from 'antd';
import axios from 'axios';
import {
  omitBy,
  isNil,
  isPlainObject,
  get as lodashGet
} from 'lodash';
import { getHeaders } from '../utils';
import { baseHost } from '@/util/baseHost';
var qs = require('qs');

// const prod = true;
export const prefix = url => {
  return `${baseHost}${url}`;
};

export const request = (url, config) => {
  return axios({
    url: prefix(url),
    method: 'get',
    withCredentials: true,
    headers: getHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    ...config,
  })
    .then(res => {
      if (res.status === 401) {
        window.location.href = '/#/login'
        return Promise.reject(res);
      }
      if (res.status === 200 && res.data.success) {
        const data = res.data.data;
        return isPlainObject(data) ? omitBy(data, isNil) : data;
      } else {
        console.log(res, 'res')
        if (res.data && res.data.message) {
          message.error(res.data.message || '内部错误，请等待响应...');
        }
        return Promise.reject(res.data);
      }
    }, (error) => {
      const httpCode = lodashGet(error, 'response.status');
      if (httpCode === 401 || httpCode === 502) {
        message.error('未登录');
        setTimeout(() => {
          window.location.href = '/#/login'
        }, 1500);
        return Promise.reject(error);
      }
      // 公共错误处理
      if (httpCode === 403) {
        message.error('权限不足');
        return;
      } else {
        message.error(error.message || '内部错误，请等待响应...');
      }
      return Promise.reject(error)
    })
};

// GET请求
export const get = (url, data, config = {}) => {
  return request(url, {
    method: 'GET',
    params: data,
    ...config
  });
};

// delete请求
export const del = (url, data, config) => {
  return request(url, {
    data: qs.stringify(data),
    method: 'delete',
    ...config,
  });
};
// put请求
export const put = (url, data, config) => {
  return request(url, {
    data: qs.stringify(data),
    method: 'put',
    ...config,
  });
};

// POST请求
export const post = (url, data, config) => {
  return request(url, {
    data: qs.stringify(data),
    method: 'POST',
    ...config,
  });
};

// POST请求
export const newPost = (url, data, config) => {
  return request(url, {
    data: data,
    method: 'POST',
    headers: getHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;charset=UTF-8',
    }),
    ...config,
  });
};

// put请求
export const newPut = (url, data, config) => {
  return request(url, {
    data: data,
    method: 'put',
    headers: getHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;charset=UTF-8',
    }),
    ...config,
  });
};

const messageMap = {
  401: '未登录',
  403: '权限不足',
  500: '服务端错误'
};
const instance = axios.create({
  baseURL: baseHost,
  withCredentials: true,
  headers: getHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  }),
});
instance.interceptors.response.use(res => {
  if (res.status === 200 && !res.data.success) { // 请求成功返回但是后台未返回成功数据，则给提示
    message.error(res.data.message);
  }
  return res.data;
}, error => {
  // 非2xx状态处理，返回{}
  if (error.response && error.response.status === 401) { // 未登录的重定向到登陆页
    setTimeout(() => {
      window.location = '/#/login';
    }, 1500);
  }
  message.error(messageMap[error.response && error.response.status] || '内部错误，请等待响应...')
  return {};
})
export function fetch(url, config = {}) {
  const {
    method = 'get', data = {}, ...others
  } = config;
  return instance.request({
    url,
    data: qs.stringify(data),
    method,
    ...others
  }).then(res => {
    return res;
  })
};