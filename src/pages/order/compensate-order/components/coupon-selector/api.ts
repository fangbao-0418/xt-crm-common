const { newPost } = APP.http

/** 优惠券列表 */
export const getCouponList = (payload: any) => {
  return newPost('/mcweb/coupon/get/couponList', payload)
}