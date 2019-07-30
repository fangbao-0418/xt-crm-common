export default function(money) {
  return `￥${(money / 100).toFixed(2)}`;
}
