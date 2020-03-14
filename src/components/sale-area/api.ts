const { newPost } = APP.http;
export function getAddress() {
  return newPost('/address/list/3')
}