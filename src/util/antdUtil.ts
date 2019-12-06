
/** DatePicker工具方法 */
/** 返回数字范围 */
export function range(start: number, end: number) {
  const result = []
  for (let i = start; i < end; i++) {
      result.push(i)
  }
  return result
}

/** 禁用日期 */
export function disabledDate (current: any, date: any) {
  return current && current < date
}

/** 禁用选中时间 */
export function disabledDateTime (date: Date) {
  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  console.log(h, m, s)
  return {
    disabledHours: () => range(0, h),
    disabledMinutes: () => range(0, m),
    disabledSeconds: () => range(0, s)
  }
}