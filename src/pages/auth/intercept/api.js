import { get, post } from '@/util/app/http';

/**
 * 获取订单拦截配置信息
 * @param {*} params
 */
export function getConfig(param) {
  return get('/order/intercept/getDispose', param);
}

export function setConfig(param) {
  return post('/order/intercept/dispose', param);
}
