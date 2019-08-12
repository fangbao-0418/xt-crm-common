export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
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