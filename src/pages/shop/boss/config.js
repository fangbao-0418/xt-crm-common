export const queryConfig = {
  statusOptions: [
    { label: '全部', value: 0 },
    { label: '已开启', value: 2 },
    { label: '已关闭', value: 3 }
  ],
  shopTypes: [
    { label: '个人店', value: 1 },
    { label: '品牌旗舰店', value: 2 },
    { label: '品牌专营店', value: 3 },
    { label: '普通企业店', value: 4 },
    { label: '工厂店', value: 5 }
  ]
}

export const shopStatusList = [{
  id: 1,
  text: '待审核'
}, {
  id: 2,
  text: '已开启'
}, {
  id: 3,
  text: '已关闭'
}]

export const auditTypeList = [{
  id: 1,
  text: '待审核'
}, {
  id: 2,
  text: '审核通过'
}, {
  id: 3,
  text: '审核不通过'
}]

export const shopStatusMap = shopStatusList.reduce((pre, next) => ({
  ...pre,
  [next.id]: next.text
}), {})

export const auditTypeMap = auditTypeList.reduce((pre, next) => ({
  ...pre,
  [next.id]: next.text
}), {})

export const switchModalConfig = {
  hint: [
    '1.店铺的商品均会下架并不可上架，店铺禁止新发商品，但保留订单处理（售后、发货）权限；',
    '2.关店后仍保留资金提现能力，若需要冻结店铺资金，请联系提供店铺信息，联系财务处理'
  ]
}