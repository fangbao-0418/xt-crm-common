import * as Fetch from '@/util/fetch';

export function getData(params) {
    return Fetch.post('/member/list', params);
}

export function sendCode(params) {
    return Fetch.fetch('/order/activationcode/sendActivationCodes', {
        data: params,
        method: 'POST'
    });
}
