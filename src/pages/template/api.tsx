import { newPost, get } from '@/util/fetch'

/**
 * 创建运费模板
 * @param data
 */
export function templateAdd (data: any) {
  return newPost('/template/add', data)
}

/**
 * 运费模板列表分页
 * @param data
 */
export function templatePage (data: any) {
  return newPost('/template/page', data)
}

/**
 * 查看单个运费模板
 * @param freightTemplateId
 */
export function getDetail (freightTemplateId: number) {
  return get('/mcweb/product/template/detail', { freightTemplateId })
}

/**
 * 编辑运费模板
 * @param data
 */
export function templateModify (data: any) {
  return newPost('/template/modify', data)
}