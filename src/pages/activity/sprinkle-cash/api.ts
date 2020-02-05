import { listResponse } from './adapter';
import { queryString } from '@/util/utils';
const { get, newPost } = APP.http;

interface payload {
  id ?: number,
  startTime: number,
  endTime: number,
  maxTaskNum: number,
  awardType: number,
  awardValue: number,
  rule: string,
  maxHelpNum: number,
  newMemberNum: number,
  maxEveryDayNum: number,
  newMemberMultiple: number
}

// 分页列表查看领现金活动
export function getPage(payload: {
  page: number,
  pageSize: number
}) {
  return get(`/dailyCash/getPage${queryString(payload)}`).then(listResponse);
}

// 保存领现金活动
export function add(payload: payload) {
  return newPost('/dailyCash/add', payload);
}

// 编辑领现金活动
export function update(payload: payload) {
  return newPost('/dailyCash/update', payload);
}

// 查看活动配置
export function getDetail(id: number) {
  return get(`/dailyCash/getDetail?id=${id}`);
}

// 关闭活动
export function over(payload: {
  id: number,
  isOverTask: 0 | 1
}) {
  return newPost('/dailyCash/over', payload);
}