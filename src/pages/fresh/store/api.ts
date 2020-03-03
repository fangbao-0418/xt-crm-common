import { listResponse } from "./adapter";

const { get } = APP.http;
export async function getShopList() {
  return { records: [
    { status: 2 },
    { status: 3 }
  ] }
  // return get('/shop/list').then(listResponse)
}