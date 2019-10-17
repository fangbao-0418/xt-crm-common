import { post } from '@/util/fetch';

/**
 * 创建运费模板
 */
export function templateAdd(data: any) {
    return post('/template/add', data)
}