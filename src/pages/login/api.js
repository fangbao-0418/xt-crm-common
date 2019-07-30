import * as Fetch from '@/util/fetch';

export function login(params) {
    return Fetch.post('/login', params);
}