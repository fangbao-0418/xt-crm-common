export default function(money) {
  if (money === '') return '-'
  return `￥${(money / 100).toFixed(2)}`;
}
