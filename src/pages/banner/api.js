// import { post } from '../../util/fetch';
const { post, newPost } = APP.http
const debug = false;

const mockData = [
  {
    id: 0,
    imgUrlWap: 'string',
    jumpUrlWap: 'string',
    offlineDateTime: 'string',
    onlineDateTime: 'string',
    seat: 0,
    sort: 0,
    status: 0,
    title: 'string',
  },
];

export function queryBannerList(data) {
  console.log('queryBannerList- params', data, new Date());

  if (debug) {
    return Promise.resolve(mockData);
  }
  return post('/banner/list', data);
}

export function getBannerDetail(data) {
  console.log('getBannerDetail- params', data, new Date());
  if (debug) {
    return Promise.resolve({
      id: 0,
      imgUrlWap: 'string',
      jumpUrlWap: 'string',
      offlineDateTime: '',
      onlineDateTime: '',
      seat: 1,
      sort: 0,
      status: 0,
      title: 'string',
    });
  }
  return post('/banner/get', data);
}

export function addBanner(data) {
  console.log('addBanner- params', data, new Date());
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/banner/add', data);
}

export function updateBanner(data) {
  console.log('updateBanner- params', data, new Date());
  if (debug) {
    return Promise.resolve(true);
  }
  return newPost('/banner/update', data);
}

export function deleteBanner(data) {
  console.log('deleteBanner- params', data, new Date());
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/banner/delete', data);
}

export function updateBannerStatus(data) {
  console.log('updateBannerStatus- params', data, new Date());
  if (debug) {
    return Promise.resolve(true);
  }
  return post('/banner/update/status', data);
}
