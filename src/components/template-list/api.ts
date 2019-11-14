import { post } from '@/util/fetch';
export function templateList() {
  return post('/template/list');
}