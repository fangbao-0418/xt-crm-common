/*
 * @Date: 2020-03-27 11:00:32
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-13 15:18:18
 * @FilePath: /xt-crm/src/pages/fresh/store/api.ts
 */
import { listResponse, formRequest, formResponse, listRequest } from './adapter'
import { newPost, newGet, newPut } from '@/util/fetch'
import { queryString } from '@/util/utils'

const { get, post } = APP.http

// 店铺列表
export async function getShopList(payload: any) {
  payload = listRequest(payload)
  const search = queryString(payload)
  return get(`/point/list${search}`).then(listResponse)
}

// 新增店铺
export function addShop(payload: any) {
  payload = formRequest(payload)
  return newPost('/point/add', payload)
}

// 编辑店铺
export function updateShop(payload: any) {
  payload = formRequest(payload)
  return newPost('/point/update', payload)
}

// 根据id查询店铺
export function getShopDetail(shopId: string) {
  return get(`/point/getById?shopId=${shopId}`).then(formResponse)
}

// 店铺开关
export function onOrOffShop(payload: {
  shopId: number,
  status: 2 | 3
}) {
  return newPost('/point/onOrOff', payload)
}

/** 获取门店类型 */
export function getTypeEnum() {
  return get('/point/typeList').then((res) => {
    console.log(res, 'res')
    return (res || []).map((record: { code: number, describe: string }) => {
      return {
        value: record.code,
        label: record.describe
      }
    })
  })
}

/** 获取门店状态 */
export function getStatusEnum() {
  return get('/point/statusList').then((res) => {
    // console.log(res, 'res')
    return (res || []).map((record: { code: number, describe: string }) => {
      return {
        value: record.code,
        label: record.describe
      }
    })
  })
}

/** 拒绝 */
export function refuse(shopId: any) {
  return get('/point/reject', {
    shopId
  })
}

/** 查询运营中心列表 */
export function pointCenterList() {
  return get('/point/center/list').then((res) => {
    return res.map((record: { code: number, name: string }) => {
      return {
        value: record.code,
        label: record.name
      }
    })
  })
}

export function getTimerList(payload: any) {
  return newGet('/point/batch/list', payload)
}

/**
 * 开启自动上下架批次
 * @param {*} ids 
 */
export function openTimerById(ids: any) {
  return newPost('/point/batch/updateActionStatus', {ids:[ids], actionStatus: 1})
}
/**
 * 关闭自动上下架批次
 * @param {*} ids 
 */
export function closeTimerById(ids: any) {
  return newPost('/point/batch/updateActionStatus', {ids:[ids], actionStatus: 0})
}

/**
 * 新建自动上下架批次
 * @param {*} payload 
 */
export function addTimer(payload: any) {
  const form = new FormData()
  form.append('file', payload.file)
  form.append('actionType', payload.actionType)
  form.append('actionTime', payload.actionTime)
  form.append('name', payload.name)
  return post('/point/batch/create', {}, {
    data: form,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}