import { post } from '@/util/fetch';
export function getPromotionList(data) {
  return post('/promotion/list', data);
}