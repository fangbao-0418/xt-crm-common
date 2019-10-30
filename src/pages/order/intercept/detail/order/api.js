import {get,post} from '@/util/app/http';

export function getData(params) {
    return post('/order/list', params);
}
