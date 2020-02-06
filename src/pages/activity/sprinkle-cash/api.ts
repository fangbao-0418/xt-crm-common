import { listResponse, requestPayload, detailResponse } from './adapter';
import { queryString } from '@/util/utils';
import { SprinkleCashFormProps } from './form';
const { get, newPost } = APP.http;

// 分页列表查看领现金活动
export function getPage(payload: {
  page: number,
  pageSize: number
}) {
  return get(`/dailyCash/getPage${queryString(payload)}`).then(listResponse);
}

// 保存领现金活动
export function add(payload: SprinkleCashFormProps) {
  return newPost('/dailyCash/add', requestPayload(payload));
}

// 编辑领现金活动
export function update(payload: SprinkleCashFormProps) {
  return newPost('/dailyCash/update', requestPayload(payload));
}

// 查看活动配置
export function getDetail(id: number) {
  return get(`/dailyCash/getDetail?id=${id}`).then(detailResponse);
}

// 关闭活动
export function over(payload: {
  id: number,
  isOverTask: 0 | 1
}) {
  return newPost('/dailyCash/over', payload);
}