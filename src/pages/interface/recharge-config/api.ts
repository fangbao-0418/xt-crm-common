/*
 * @Date: 2020-04-28 14:00:21
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-15 14:56:24
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/pages/interface/recharge-config/api.ts
 */
const { post, get, newPost } = APP.http
import { RecordProps } from './interface'

/**
 * 获取一级类目
 */
export function getCategoryTopList () {
  return post('/category/list', { level: 1 }).then((res) => {
    return (res || []).map((item: { name: string, id: any }) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  })
}

/** 获取商品列表 */
export function fetchSelectShopList (payload: {
  productId?: any
  productName?: string
  status?: number
  categoryIds?: string
  page?: number
  pageSize?: number
  hasSku?: boolean
  types?: number[]
}) {
  payload.hasSku = true
  payload.types = [50]
  return post<PageProps<Shop.ShopItemProps>>('/product/list', payload).then((res) => {
    res.records = (res.records || []).map((item) => {
      item.skuList = item.skuList || []
      item.skuList.map((val) => {
        val.productId = item.id
        val.productName = item.productName
        val.coverUrl = item.coverUrl
        val.properties = `${item.property1 || ''}:${val.propertyValue1};${item.property2 || ''}:${val.propertyValue2}`
        return val
      })
      return item
    })
    return res
  })
}

/**
 * 获取虚拟商品列表
 */
export const fetchGoodsList = () => {
  return get<RecordProps[]>('/mcweb/product/virtual/get', {
    type: 1
  })
}

/**
 * 保存商品配置
 */
export const saveGoodsConfig = (payload: {
  productId: any
  skuId: any
  sort: number
}[]) => {
  const data = {
    type: 1,
    items: payload
  }
  return newPost('/mcweb/product/virtual/edit', data)
}

/**
 * 刷新
 */
export const refreshGoods = () => {
  return post('/mcweb/product/virtual/refresh', {
    type: 1
  })
}

// 获取优惠券列表
export function getCouponlist (data: any) {
  return newPost('/mcweb/coupon/get/couponList', data)
}