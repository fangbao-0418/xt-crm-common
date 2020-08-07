const { newPost } = APP.http

/** 优惠券列表 */
export const getCouponList = (payload: any) => {
  return newPost('/mcweb/coupon/get/couponList', payload)
}

/** 切换补偿优惠券列表 */
export const getCompensateCouponList = (payload: any) => {
  return newPost('/mcweb/sale-after/order/compensate/getCouponsByPage', payload)
}