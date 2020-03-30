const { post } = APP.http;

export function getGoodsList(data) {
  return post('/product/list', data);
}