import * as Fetch from '@/util/fetch';
import { get, post } from '@/util/app/http';
var qs = require('qs');

export function getCouponList(memberId, data) {
    return Fetch.post(`/member/get/getCouponList/${memberId}`, data);
}
export function getUserInfo(params) {
    return Fetch.request(`/member/detail?${qs.stringify(params)}`);
}

export function updateInviteUser(params) {
    return Fetch.post('/member/invited/update', params);
}

export function checkInvited(params) {
    return Fetch.request(`/member/invited/info?${qs.stringify(params)}`);
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
export function getIncome(param) {
    return post(`/crm/member/settlement/v1/query`, {}, { data: param, headers: {} });
}

//提现记录
export function getLog(params) {
    return Fetch.post('/member/withdrawalList', params);
}

//编辑用户信息
export function updateUserInfo(params) {
    return Fetch.post('/member/update', params);
}

/**
 * 根据订单Id和会员Id获取用户收益列表
 * @param {object} data  
 */
export function getProceedsListByOrderIdAndMemberId(param) {
    return get(`/crm/member/settlement/v1/order/skuSummaryByMember`, param);
}

/**
 * 根据订单Id和会员Id和SKUId获取用户收益列表
 * @param {object} data  
 */
export function getProceedsListByOrderIdAndMemberIdAndSkuId(param) {
    return get(`/crm/member/settlement/v1/detail`, param);
}
