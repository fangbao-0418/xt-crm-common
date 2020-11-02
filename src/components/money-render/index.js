export default function (money) {
  money = money || ''
  if (money === '') {
    return '￥0.00'
  }
  return `￥${(money / 100).toFixed(2)}`
}
