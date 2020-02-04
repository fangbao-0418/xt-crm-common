const { get, post } = APP.http;
// 分页列表查看领现金活动
export function getPage() {
  return get(`/dailyCash/getPage`);
}

// 查看活动配置
export function getDetail(id: number) {
  return get(`/dailyCash/getDetail?id=${id}`);
}

// 关闭活动
export function over(payload: { id: number }) {
  return post('/dailyCash/over', payload);
}