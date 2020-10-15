import { newPost } from "@/util/fetch";

// 置顶
export async function topOperate () {}

/** 查询文章列表 */
export function getArticleList (payload: {
  title: string,
  columnId: number,
  platform: number,
  id: number,
  status: number,
  page: number,
  pageSize: number
}) {
  return newPost('/mcweb/octupus/discover/article/list')
}