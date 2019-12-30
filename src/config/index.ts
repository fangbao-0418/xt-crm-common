export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
export const formButtonLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
}

export const formLeftButtonLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 18, offset: 6 },
}

export const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

export const orderRefunds = {
  '0': '无售后',
  '10': '待审核',
  '20': '处理中',
  '21': '处理中（退款失败）',
  '22': '处理中（退货退款中）',
  '23': '处理中（退款中）',
  '24': '处理中（换货中）',
  '30': '已完成',
  '40': '驳回'
}

export const orderStatusEnums = {
  '10': '未付款',
  '20': '待发货',
  '30': '已发货',
  '40': '已收货',
  '50': '完成',
  '60': '关闭'
}

export const ORDER_TYPE = {
  '0': '普通订单',
  '10': '激活码订单',
  '20': '地推订单',
  '30': '助力分兑换订单',
  '40': '采购订单',
  '60': '团购会订单',
  '70': '海淘订单',
  '80': '团购会采购订单'
}

export const ExpressCompanyOptions: any = {
  ems: 'EMS',
  shunfeng: '顺丰',
  shentong: '申通',
  yuantong: '圆通',
  zhongtong: '中通',
  huitongkuaidi: '汇通',
  yunda: '韵达',
  guotongkuaidi: '国通',
  debangwuliu: '德邦',
  jd: '京东',
  tiantian: '天天快递',
  youzhengbk: "邮政标准快递",
  youzhengguonei: "邮政快递包裹",
  annengwuliu: "安能物流",
  zhaijisong: "宅急送",
  lbex: "龙邦物流",
  youshuwuliu: "优速物流",
  pjbest: "品骏",
  suning: "苏宁物流",
  suer: "速尔快递",
  zhongtongkuaiyun: "中通快运"
};
