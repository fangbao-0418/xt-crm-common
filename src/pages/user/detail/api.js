import * as Fetch from "@/util/fetch";
import { get, post, newPost } from "@/util/app/http";
import { userInfoResponse } from "./components/userInfo/adapter";
var qs = require("qs");

export function getCouponList(memberId, data) {
  return Fetch.post(`/member/get/getCouponList/${memberId}`, data);
}

export async function getUserInfo(params) {
  const bizSource = params.bizSource
  delete params.bizSource
  const path = bizSource === '20' ? `/mcweb/memberm/pop/detail?${qs.stringify(params)}` : `/member/detail?${qs.stringify(params)}`
  const res =
    (await Fetch.request(path)) || {};
  return userInfoResponse(res);
}

/** 修改邀请人 */
export function updateInviteUser(params) {
  const url = params?.tab === 2 ? '/mcweb/memberm/pop/invited/update' : '/member/invited/update'
  return Fetch.post(url, {
    ...params,
    bizSource: undefined
  });
}

export function checkInvited(params) {
  const query = qs.stringify({
    ...params,
    tab: undefined
  })
  const url = params.tab === 2 ? '/mcweb/memberm/pop/phone' : '/member/invited/info'
  return get(`${url}?${query}`);
}

// 推荐
export function getRecommend(params) {
  const bizSource = params.bizSource
  delete params.bizSource
  const path = bizSource === '20' ? '/mcweb/memberm/pop/inviteList' : '/member/inviteList'
  return Fetch.request(`${path}?${qs.stringify(params)}`);
}

// 团队
export function getTeam(params) {
  return Fetch.request(`/member/teamList?${qs.stringify(params)}`);
}

// 收益
export function getIncome(param) {
  // const url = param.tab === '2' ? '/mcweb/account/pop/settlement/list' : ''
  if (param.tab === '2') {
    return post(
      '/mcweb/account/pop/settlement/list',
      {},
      { data: {
        ...param,
        tab: undefined
      }, headers: {} }
    ).then((res) => {
      return {
        ...res,
        list: res.records,
        pageNum: res.page,
        pageSize: res.size
      }
    })
  } else {
    return post(
      '/crm/member/settlement/v1/query',
      {},
      { data: {
        ...param,
        tab: undefined
      }, headers: {} }
    )
  }
}

//提现记录
export function getLog(param) {
  // const url = param.tab === '2' ? '/mcweb/account/pop/withdrawalList' : '/crm/member/settlement/v1/query'
  const url = '/mcweb/account/pop/withdrawalList'
  return Fetch.post(url, {
    ...param,
    bizType: param.tab,
    tab: undefined
  });
}

//编辑用户信息
export function updateUserInfo(params) {
  // params?.bizSource === 2 ? '/mcweb/memberm/invited/update'
  return Fetch.post("/member/update", params);
}

/**
 * 根据订单Id和会员Id获取用户收益列表
 * @param {object} data
 */
export function getProceedsListByOrderIdAndMemberId(param) {
  const url = param.tab === '2'  ? '/mcweb/account/pop/order/skuSummaryByMember' : '/crm/member/settlement/v1/order/skuSummaryByMember'
  return get(url, {
    ...param,
    tab: undefined
  });
}

/**
 * 根据订单Id和会员Id和SKUId获取用户收益列表
 * @param {object} data
 */
export function getProceedsListByOrderIdAndMemberIdAndSkuId(param) {
  if (param.tab === '2') {
    return get(`/mcweb/account/pop/settlement/detail`, {
      ...param,
      tab: undefined
    });
  }
  return get(`/crm/member/settlement/v1/detail`, {
    ...param,
    orderId: undefined,
    tab: undefined
  });
}

//操作会员身份
export function memberModify(params) {
  const url = params.tab === 2 ? '/mcweb/memberm/pop/member/modify' : '/manager/member/modify'
  return newPost(url, {
    ...params,
    tab: undefined
  });
}

//获取通用操作原因列表
export function getReasonList() {
  return newPost("/manager/reason/list");
}

// 解绑临时锁粉
export function setMemberUnlocking(params) {
  const url = params?.tab === 2 ? '/mcweb/memberm/pop/unlocking' : '/member/unlocking'
  return Fetch.post(url, { ...params, tab: undefined });
}

// 添加黑名单操作
export function addBlack(params) {
  return newPost("/manager/black/add", params);
}
// 删除黑名单操作
export function delBlack(params) {
  return newPost("/manager/black/del", params);
}
// 微信解除绑定操作
export function relieveWechat(params) {
  return get("/manager/wechat/relieve", {
    ...params
  });
}
// 修改手机操作
export function exchangePhone(params) {
  return get("/manager/phone/exchange", params);
}

export async function getGoodStoreUserInfo(params) {
  const url = `/mcweb/memberm/pop/detail?${qs.stringify({
    ...params,
    bizSource: undefined
  })}`
  const res =
    (await Fetch.request(url)) || {};
  return userInfoResponse(res);
}
