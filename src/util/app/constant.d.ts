interface constantProps {
  // 物流公司
  expressList: { label: string, value: string }[],
  // 物流公司code到name映射
  expressConfig: { [propName: string]: string}
}