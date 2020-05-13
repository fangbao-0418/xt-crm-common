const { post } = APP.http

export function getCategoryList () {
  return post('/category/treeCategory')
}