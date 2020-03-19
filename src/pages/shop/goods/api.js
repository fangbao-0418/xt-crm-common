const { post, newPost } = APP.http;

/** 获取商品列表 */
export function getGoodsList(data) {
  return newPost('/shop/product/list', data);
}

/** 获取违规历史列表 */
export function getOperateList(data) {
  return newPost('http://192.168.4.205:8080/product/operate/list', {
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

