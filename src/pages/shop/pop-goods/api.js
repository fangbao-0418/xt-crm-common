const { post, newPost, get } = APP.http;
// http://192.168.4.205:8082

/** 供应商/店铺模糊查询 */
export function getShopList(name) {
  return newPost('/mmweb/supplier/shop/V1/search', { name, searchType: 1 })
    .then((res) => res.map(v => ({ text: v.name, value: v.id })))
}

/** 获取商品列表 */
export function getGoodsList(data) {
  return newPost('/shop/product/list', data);
}

/** 获取商品详情信息 */
export function getGoodsInfo(data) {
  return get('/shop/product/detail', data);
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
  return get('/shop/v1/query/type').then((res) => {
    return (res || []).map((item) => {
      return {
        label: item.tag,
        value: item.code
      }
    })
  })
}


/** 通过商品 审核（2-审核通过,3-审核不通过) */
export function passGoods(data) {
  return newPost('/shop/product/audit', {
    ...data,
    auditStatus: 2
  });
}

/** 不通过商品 审核（2-审核通过,3-审核不通过) */
export function unPassGoods(data) {
  return newPost('/shop/product/audit', {
    ...data,
    auditStatus: 3
  });
}

/** 下架商品 */
export function lowerGoods(data) {
  return newPost('/shop/product/disable', data);
}

/** 商品导出 */
export function exportGoods(data) {
  return get('/mcweb/product/shop/pop/export', data);
}
