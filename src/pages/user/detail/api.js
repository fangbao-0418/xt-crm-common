import * as Fetch from '@/util/fetch';
import { get, post, newPost } from '@/util/app/http';
import { userInfoResponse } from './components/userInfo/adapter'
var qs = require('qs');

export function getCouponList(memberId, data) {
    return Fetch.post(`/member/get/getCouponList/${memberId}`, data);
}
export async function getUserInfo(params) {
    const res = await Fetch.request(`/member/detail?${qs.stringify(params)}`) || {}
    return userInfoResponse(res);
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

//操作会员身份
export function memberModify(params) {
    return newPost('/manager/member/modify', params);
}

//获取通用操作原因列表
export function getReasonList() {
    return newPost('/manager/reason/list');
}

// 解绑临时锁粉
export function setMemberUnlocking(params) {
    return Fetch.post('/member/unlocking', params);
}

// 添加黑名单操作
export function addBlack(params) {
    return Fetch.post('/manager/black/add', params)
}
// 删除黑名单操作
export function delBlack(params) {
    return Fetch.post('/manager/black/del', params)
}
// 微信解除绑定操作
export function relieveWechat(params) {
    return get('/manager/wechat/relieve', params);
}
// 修改手机操作
export function exchangePhone(params) {
    return get('/manager/phone/exchange', params);
}