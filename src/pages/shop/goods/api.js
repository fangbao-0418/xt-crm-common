import { message } from 'antd';

const { post } = APP.http;

export function getStoreList(data, config) {
  return post('/store/list', data, config);
}

/** 获取商品列表 */
export function getGoodsList(data) {
  return post('/product/list', data);
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

/** 通过商品 */
export function passGoods(data) {
  return new Promise((resolve) => {
    console.log('todo: 这里是审核通过商品的入参', data)
    message.success('审核通过成功!');
    setTimeout(() => {
      resolve(true)
    }, 500)
  });
}

/** 不通过商品 */
export function unPassGoods(data) {
  return new Promise((resolve) => {
    console.log('todo: 这里是审核不通过商品的入参', data)
    setTimeout(() => {
      resolve(true)
    }, 500)
  });
}

/** 下架商品 */
export function lowerGoods(data) {
  return new Promise((resolve) => {
    console.log('todo: 这里是下架商品的入参', data)
    setTimeout(() => {
      resolve(true)
    }, 500)
  });
}

