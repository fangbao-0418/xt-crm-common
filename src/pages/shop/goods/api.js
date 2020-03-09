import { message } from 'antd';
import { list, audit, disable } from './mock'

const { post } = APP.http;

/** 获取商品列表 */
export function getGoodsList(data) {
  console.log('todo 入参', data)
  return new Promise((r) => {
    setTimeout(() => {
      r(list.data)
    }, 500)
  })
  // return post('/shop/product/list', data);
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
  return new Promise((resolve) => {
    console.log('todo: 这里是审核通过商品的入参', {
      ...data,
      auditStatus: 2
    })
    message.success('审核通过成功!');
    setTimeout(() => {
      resolve(audit.success)
    }, 500)
  });
  // return post('/shop/product/audit', {
  //   ...data,
  //   auditStatus: 2
  // });
}

/** 不通过商品 审核（2-审核通过,3-审核不通过) */
export function unPassGoods(data) {
  return new Promise((resolve) => {
    console.log('todo: 这里是审核不通过商品的入参', {
      ...data,
      auditStatus: 3
    })
    setTimeout(() => {
      resolve(audit.success)
    }, 500)
  });
  // return post('/shop/product/audit', {
  //   ...data,
  //   auditStatus: 3
  // });
}

/**
 * 下架商品
 * todo: 后端缺少入参
 */
export function lowerGoods(data) {
  return new Promise((resolve) => {
    console.log('todo: 这里是下架商品的入参', data)
    setTimeout(() => {
      resolve(disable.success)
    }, 500)
  });
  // return post('/shop/product/disable', data);
}

