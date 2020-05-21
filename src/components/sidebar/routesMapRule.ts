/*
 * @Date: 2020-05-06 10:32:12
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-06 19:57:50
 * @FilePath: /xt-crm/src/components/sidebar/routesMapRule.ts
 */

const rules = {
  '/goods/list': [
    /^\/goods\/sku-sale(\/)?(\d+)?/
  ],
  '/template/page': [
    /template\/edit(\/)?(\d+)?/
  ],
  '/goods/check': [
    /^\/goods\/detail(\/)?(\d+)?/
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
    /^\/order\/detail(\/)?(\d+)?/
  ],
  '/order/autoRefundRule': [
    /^\/order\/autoRefundRule(\/)?(\d+)?/
  ],
  '/fresh/order/mainOrder': [
    /fresh\/order\/detail(\/)?(\d+)?/
  ],
  // '/message/template': [
  //   /^\/message\/template(\/)?/
  // ]
  '/goods/sku-stock': [
    /goods\/sku-stock(\/)?(\d+)?/
  ],
  '/activity/lottery': [
    /activity\/lottery(\/)?(\d+)?/
  ],
  '/activity/reward': [
    /activity\/reward(\/)?(\d+)?/
  ],
  '/activity/sprinkle-cash': [
    /activity\/sprinkle-cash\/form(\/)?(\d+)?/
  ],
  '/activity/full-discount': [
    /activity\/full-discount\/edit(\/)?(\d+)?/,
    /activity\/full-discount\/detail(\/)?(\d+)?/,
    /activity\/full-discount\/copy(\/)?(\d+)?/,
  ],
  '/user/userlist': [
    /user\/detail(\/)?(\d+)?/,
  ],
  '/interface/goods-recommend': [
    /interface\/goods-recommend(\/)?(\d+)?/,
  ],
  '/interface/purchase-category': [
    /interface\/purchase-category(\/)?(\d+)?/,
  ],
  '/interface/special': [
    /interface\/special$/,
    /interface\/special\/-1$/,
  ],
  '/interface/special-content': [
    /interface\/special-content(\/)?(\d+)?/,
  ],
  '/message/list': [
    /message\/detail(\/)?(\d+)?/,
  ],
  '/message/template': [
    /message\/template\/detail(\/)?(\d+)?/,
  ],
  '/fresh/store': [
    /fresh\/store$/,
    /fresh\/store\/-1$/,
  ],
  '/fresh/store/timer': [
    /fresh\/store$/,
  ],
  '/fresh/saleAfter': [
    /fresh\/saleAfter\/detail(\/)?(\d+)?/,
  ],
  '/interface/group-buying/category': [
    /interface\/group-buying\/category(\/)?(\d+)?/,
  ],
  '/shop/goods': [
    /shop\/goods\/detail(\/)?(\d+)?/,
  ],
  '/fresh/coupon': [
    /fresh\/coupon\/bulkissuing(\/)?(\d+)?/,
    /fresh\/coupon\/detail(\/)?(\d+)?/,
  ]
}
export default rules

const b: any = {

}
