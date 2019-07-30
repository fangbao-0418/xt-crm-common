import { post } from '../../util/fetch';
const debug = true;

const mockData = {
  code: 'string',
  data: {
    current: 0,
    pages: 0,
    records: [
      {
        code: 'string',
        contacts: 'string',
        email: 'string',
        id: 0,
        name: 'string',
        phone: 'string',
        shortName: 'string',
      },
    ],
    searchCount: true,
    size: 0,
    total: 0,
  },
  message: 'string',
  success: true,
};

export function getStoreList(data) {
  if (!debug) {
    return Promise.resolve(mockData);
  }
  return post('/store/list', data);
}
