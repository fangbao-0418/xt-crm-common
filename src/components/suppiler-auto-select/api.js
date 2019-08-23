import { post } from '@/util/fetch';

export function getStoreList(data) {
    return post('/store/list', data)
}