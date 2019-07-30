import { get } from '../../util/fetch';

export function getStsPolicy(data) {
  return get('/oss/stspolicy', data);
}
