import { newPost, newGet, newPut, post } from '../../../util/fetch';

//获取定价策略列表
export function getPromotionList(data) {
  return newPost('/product/price/rule/queryRule', data);
}

//获取商品类目
export function getCategory(data) {
  return post('/category/list', data);
}

//禁用or开启定价策略
export function putIsAvailable(data) {
  return newPut(`/product/price/rule/isAvailable?ruleId=${data.ruleId}`);
}

//新增定价策略
export function saveRule(data) {
  return newPost('/product/price/rule/saveRule', data);
}

//修改定价策略
export function editRule(data) {
  return newPost('/product/price/rule/updateRule', data);
}

//根据类目id查询定价策略
export function getByCategoryId(categoryId) {
  return newGet(`/product/price/rule/${categoryId}`)
}

//根据策略id查询定价策略
export function getByRuleId(ruleId) {
  return newGet(`/product/price/rule/${ruleId}`)
}
