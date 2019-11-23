import { get } from '@/util/app/http';

export function getLogByMemberId(params) {
  return get('/order/intercept/pageQueryInterceptLog', params);
}
