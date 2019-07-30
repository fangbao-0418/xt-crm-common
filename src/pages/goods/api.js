import { post, exportFile } from '../../util/fetch';

export function getStoreList(data) {
  return post('/store/list', data);
}

export function setProduct(data) {
  const url = data.productId ? '/product/update' : '/product/add';
  return post(url, {}, { data, headers: {} });
}

export function getGoodsList(data) {
  return post('/product/list', data);
}

export function getGoodsDetial(data) {
  return post('/product/detail', data);
}

export function delGoodsDisable(data) {
  return post('/product/disable', {}, { data, headers: {} });
}

export function enableGoods(data) {
  return post('/product/enable', {}, { data, headers: {} });
}

export function exportFileList(data) {
  return exportFile('/product/export', data);
}

export function getCategoryList() {
  return post('/category/treeCategory');
}
