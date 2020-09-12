import * as Fetch from '@/util/fetch'
import * as adapter from './adapter'

export const getData = APP.fn.wrapApi((payload) => {
    const bizSource = payload.bizSource
    delete payload.bizSource
    let path = bizSource === '20' ? '/mcweb/memberm/pop/list' : '/member/list'
    const req = adapter.memberListParams(payload)
    return Fetch.post(path, req)
})

export function sendCode(params) {
    return Fetch.fetch('/order/activationcode/sendActivationCodes', {
        data: params,
        method: 'POST'
    })
}
