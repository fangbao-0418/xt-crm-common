/*
 * @Date: 2020-03-06 10:18:13
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-30 20:07:26
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/pages/fresh/goods/api.js
 */

const { post, get, newPost, newPut } = APP.http
/**
 * 获取素材列表
 */
export function getMaterial (data: any) {
  return newPost('/product/material/query', data)
}

/** 获取用户信息 */
export const fetchUserInfo = (payload: {
  memberId?: number
  phone?: string
}) => {
  return get('/member/simple', payload)
}

/**
 * 新增商品素材
 */
export const addProductMaterial = (data: any) => {
  return newPost('/mcweb/product/material/add', data)
}

/**
 * 修改商品素材
 */
export const editProductMaterial = (data: any) => {
  return newPost('/mcweb/product/material/edit', data)
}

/**
 * 查询商品素材列表
 */
export const getProductMaterialList = (data: any) => {
  return get('/mcweb/product/material/query', data)
}

/**
 * 查询商品素材单个
 */
export const getProductMaterialId = (materialId: number) => {
  return get('/mcweb/product/material/getById', {materialId})
}

/**
 * 置顶商品素材
 */
export const stickUp = (materialId: number) => {
  return newPost(`/mcweb/product/material/stickUp?materialId=${materialId}`)
}

/**
 * 设置显示隐藏商品素材
 */
export const editShowStatus = (materialId: number) => {
  return newPost(`/mcweb/product/material/setStatus?materialId=${materialId}`)
}

/**
 * 设置显示隐藏商品素材
 */
export const deleteMaterial = (materialId: number) => {
  return newPost(`/mcweb/product/material/delete?materialId=${materialId}`)
}