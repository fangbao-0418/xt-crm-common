import { message } from 'antd';
import axios from 'axios';
import { omitBy, isNil, isPlainObject, get as lodashGet } from 'lodash';
import { formatData, getHeaders, prefix } from './utils';
var qs = require('qs');
// const prod = true;
let ajaxCount = 0;
const handleLoading = () => {
  ajaxCount++
}
export const request = (url, config) => {
  handleLoading()
  const _config = {
    url: prefix(url),
    method: 'get',
    withCredentials: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    ...config
  }
  _config.headers = getHeaders(_config.headers);
  return axios(_config)
    .then(res => {
      handleLoading()
      if (res.status === 401) {
        window.location = '/#/login';
        return;
      }
      if (res.status === 200 && res.data.success) {
        const data = res.data.data;
        return isPlainObject(data) ? omitBy(data, isNil) : data;
      } else {
        return Promise.reject(res.data);
      }
    })
    .catch(error => {
      handleLoading()
      const httpCode = lodashGet(error, 'response.status');
      if (httpCode === 401 || httpCode === 502) {
        message.error('未登录');
        setTimeout(() => {
          window.location = '/#/login';
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
      // return Promise.resolve(error);
    });
};

// GET请求
export const get = (url, data, config = {}) => {
  return request(url, { method: 'GET', params: data, ...config });
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

// GET请求
export const newGet = (url, data, config) => {
  return request(url, {
    params: data,
    method: 'GET',
    ...config,
    headers: getHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  });
};

// POST请求
export const newPost = (url, data, config) => {
  return request(url, {
    data: data,
    method: 'POST',
    ...config,
    headers: getHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  });
};

// put请求
export const newPut = (url, data, config) => {
  return request(url, {
    data: data,
    method: 'put',
    ...config,
    headers: getHeaders({
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;charset=UTF-8',
    }),
  });
};

function getFileName(disposition) {
  if (!disposition) {
    return '';
  }
  const idx = disposition.lastIndexOf('=');
  return decodeURI(disposition.slice(idx + 1));
}

function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
           encodeURIComponent(json[key])
  })).join('&')
}

// exportHelper
export const exportFile = (url, data, config) => {
  // return new Promise((resolve, reject) => {
  //   window.open(prefix('') + url + '?' + formatData(data));
  //   resolve()
  // })
  
  url = param(data) ? `${prefix(url)}?${param(data)}` : prefix(url);
  return axios({
    url,
    method: 'get',
    withCredentials: true,
    headers: getHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    responseType: 'blob',
  })
    .then(async function (res) {
      if (res.data.type === 'application/json') {
        return Promise.reject(res.data);
      }
      var blob = new Blob([res.data], { type: res.headers['content-type'] });
      const text = await blob.text();
      const [fileName, blobText] = text.split('/attachment/')
      // const fileName = getFileName(res.headers['content-disposition']);
      var downloadElement = document.createElement('a');
      blob = new Blob([blobText], {type: 'text/plain'})
      console.log('blob==>', blob);
      var href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
      downloadElement.target = '_blank';
      fileName && (downloadElement.download = fileName); //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
    })
    .catch(function (error) {
      if (error.type === 'application/json') {
        var reader = new FileReader();
        reader.addEventListener("loadend", function () {
          const obj = JSON.parse(reader.result);
          message.error(obj.message);
        });
        return reader.readAsText(error);
      }
      const httpCode = lodashGet(error, 'response.status');
      if (httpCode === 401) {
        message.error('未登录');
        setTimeout(() => {
          window.location = '/#/login';
        }, 1500);
        return Promise.reject();
      }

      // 公共错误处理
      if (httpCode === 403) {
        message.error('权限不足');
      } else {
        message.error(error.message || '内部错误，请等待响应...');
      }
      return Promise.reject();
    });
};



const messageMap = {
  401: '未登录',
  403: '权限不足',
  500: '服务端错误'
};
const instance = axios.create({
  baseURL: prefix(''),
  withCredentials: true,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});
instance.interceptors.request.use((config) => {
  config.headers = getHeaders(config.headers);
  return config;
}, (error) => {
  return Promise.reject(error);
})

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
  const { method = 'get', data = {}, ...others } = config;
  return instance.request({
    url,
    data: qs.stringify(data),
    method,
    ...others
  }).then(res => {
    return res;
  })
};
