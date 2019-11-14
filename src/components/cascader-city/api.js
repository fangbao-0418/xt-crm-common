import { post } from '@/util/app/http';

export function getProvinces(payload) {
    return post(`/address/list/2`, payload)
}