/*
 * @Date: 2020-05-07 19:37:36
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-11 10:28:05
 * @FilePath: /xt-crm/src/pages/goods/virtual/api.ts
 */
import { formRequest, baseProductResponse, baseProductPageResponse, formResponse, baseSkuDetailResponse } from '../sku-sale/adapter'
import { queryString } from '@/util/utils'
import { omit } from 'lodash'
const { newPost, get } = APP.http

// 获取虚拟商品详情
export const fetchGoodDetail = () => {
  return get('/mcweb/product/virtual/get')
}