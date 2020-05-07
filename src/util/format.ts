/*
 * @Author: fangbao
 * @Date: 2020-03-18 22:14:36
 * @LastEditors: fangbao
 * @LastEditTime: 2020-04-30 00:59:04
 * @FilePath: /eslint-plugin-xt-react/Users/fb/Documents/xituan/xt-crm/src/util/format.ts
 */
import { initImgList } from "./utils";

export function formatPrice(val: number, precision: number = 2): number {
    if (!val) return 0;
    val = Number(val) || 0;
    const radix = Math.pow(10, precision);
    return Math.round(val) / radix;
}

export function formatRMB(value: string | number | undefined) {
  return `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function replaceHttpUrl (imgUrl?: string) {
  return APP.fn.deleteOssDomainUrl(imgUrl || '')
}

// 数组转换到字符串
function array2String (list: any[]) {
  return (list || []).map((item: any) => replaceHttpUrl(item.url)).join(',');
}

// 字符串转数组
  function string2Array(value: string) {
    return (value || '').split(',').reduce((prev: any[], curr) => prev.concat(initImgList(curr)), [])
  }
  
  // 过滤上传组件请求或者响应
  export function filterUploadFile(
    data: any,
    type: 'req' | 'res' = 'req',
    fields: string[] = ['videoCoverUrl', 'videoUrl', 'coverUrl', 'productImage', 'bannerUrl', 'listImage']
  ) {
    const result: any = {};
    fields.forEach(name => {
      result[name] = type === 'req' ?
        array2String(data[name]) :
        string2Array(data[name]);
    })
    return { ...data, ...result};
  }
  