import * as Fetch from '@/util/fetch';
var qs = require('qs');

export function getUserInfo(params) {
    return Fetch.request(`/member/detail?${qs.stringify(params)}`);
}

// 推荐
export function getRecommend(params) {
    return Fetch.request(`/member/inviteList?${qs.stringify(params)}`);
}

// 团队
export function getTeam(params) {
    return Fetch.request(`/member/teamList?${qs.stringify(params)}`);
}

// 收益
export function getIncome(params) {
    return Fetch.request(`/member/incomeList?${qs.stringify(params)}`);
}

//提现记录
export function getLog(params) {
    return Fetch.post('/member/withdrawalList', params);
}

//编辑用户信息
export function updateUserInfo(params) {
    return Fetch.post('/member/update', params);
}