import * as Fetch from '@/util/fetch';
var qs = require('qs');

export function getData({params, data}) {
    return Fetch.post(`/order/activationcode/list?${qs.stringify(params)}`, data);
}

export function updateStatus(params) {
    return Fetch.fetch(`/order/activationcode/updateByStatus/${params.id}`, {
        method: 'PUT'
    });
}