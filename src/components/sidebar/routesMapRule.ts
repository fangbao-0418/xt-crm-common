/*
 * @Date: 2020-05-06 10:32:12
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-06 11:36:12
 * @FilePath: /xt-crm/src/components/sidebar/routesMapRule.ts
 */

const rules = {
  '/goods/list': [
    /goods\/sku-sale(\/)?(\d+)?/
  ],
  '/template/page': [
    /template\/edit(\/)?(\d+)/
  ],
  '/goods/check': [
    /goods\/detail(\/)?(\d+)?/
  ],
  '/activity/list': [
    /^\/activity\/info(\/)?edit(\/)?(\d+)?/,
    /^\/activity\/info(\/)?detail(\/)?(\d+)?/,
  ],
  '/coupon/get/couponList': [
    /^\/coupon\/get(\/)?couponList(\/)?/,
  ],
  '/activity/marketing': [
    /^\/activity\/marketing(\/)?/,
  ],
  '/fresh/goods/list': [
    /fresh\/goods\/sku-sale(\/)?(\d+)?/
  ],
  '/fresh/goods/check': [
    /fresh\/goods\/detail(\/)?(\d+)?/
  ],
  '/order/mainOrder': [
    /order\/detail(\/)?(\d+)?/
  ],
  '/fresh/order/mainOrder': [
    /fresh\/order\/detail(\/)?(\d+)?/
  ],
  '/message/template': [
    /^\/message\/template(\/)?/
  ]
}
export default rules

const b: any = {

}
