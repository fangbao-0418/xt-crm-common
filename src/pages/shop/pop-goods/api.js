import { exportFile } from '@/util/fetch'
import { param } from '@/packages/common/utils'

const { post, newPost, get } = APP.http;

/** 供应商/店铺模糊查询 */
export function getShopList(name) {
  return newPost('/mmweb/supplier/shop/V1/search', { name, searchType: 1 })
    .then((res) => res.map(v => ({ text: v.name, value: v.id })))
}

/** 获取商品列表 */
export function getGoodsList(data) {
  return newPost('/shop/product/list', {
    ...data,
    shopTypes: data?.shopTypes?.length ? data.shopTypes : [3, 4, 5, 6]
  });
}

/** 获取商品详情信息 */
export function getGoodsInfo(data) {
  return get('/shop/product/detail', {
    ...data
  });
}

/** 获取违规历史列表 */
export function getOperateList(data) {
  return newPost('/product/operate/list', {
    ...data,
    type: 1,
    pageSize: 10
  });
}

/** 获取一级类目 */
export function getCategoryTopList() {
  return post('/category/list', { level: 1 }).then((res) => {
    return (res || []).map((item) => {
      return {
        label: item.name,
        value: item.id
      }
    })
  })
}

// 获取店铺类型
export function getShopTypes () {
  // return get('/shop/v1/query/type').then((res) => {
  //   return (res || []).map((item) => {
  //     return {
  //       label: item.tag,
  //       value: item.code
  //     }
  //   })
  // })
  return Promise.resolve([
    { label: '品牌旗舰店', value: 3 },
    { label: '品牌专营店', value: 4 },
    { label: '喜团工厂店', value: 5 },
    { label: '普通企业店', value: 6 }
  ])
}


/** 通过商品 审核（2-审核通过,3-审核不通过) */
export function passGoods(data) {
  return newPost('/shop/product/audit', {
    ...data,
    auditStatus: 2,
    /** requestType 1-小店（不校验channel） 2-pop */
    requestType: 2
  });
}

/** 不通过商品 审核（2-审核通过,3-审核不通过) */
export function unPassGoods(data) {
  return newPost('/shop/product/audit', {
    ...data,
    auditStatus: 3,
    /** requestType 1-小店（不校验channel） 2-pop */
    requestType: 2,
    channel: 2
  });
}

/** 下架商品 */
export function lowerGoods(data) {
  return newPost('/shop/product/disable', data);
}

/** 商品导出 */
export function exportGoods(data) {
  const query = param(data)
  return APP.fn.exportFile('/mcweb/product/shop/pop/export?' + query, 'pop商品数据.xls');
}

/** 导入商品建议供应价 */
export function importAdvisePrice (file) {
  const data = new FormData()
  data.append('file', file)
  return post('/mcweb/product/shop/pop/import', {}, {
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}