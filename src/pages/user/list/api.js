import * as Fetch from '@/util/fetch'
import * as adapter from './adapter'

export function getData(payload) {
    const req = adapter.memberListParams(payload)
    return Fetch.post('/member/list', req)
}

export function sendCode(params) {
    return Fetch.fetch('/order/activationcode/sendActivationCodes', {
        data: params,
        method: 'POST'
    })
}
