import moment from "moment";

/** DatePicker工具方法 */
/** 返回数字范围 */
export function range(start: number, end: number) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

/** 禁用日期 */
export function disabledDate(current: moment.Moment | null, date: any) {
  return (
    !!current &&
    current <
      moment(date)
        .endOf("day")
        .subtract(1, "day")
  );
}

/*
 * 禁用date时间之前
 * @params current 当前选中禁用时间
 * @params date 禁用时间与什么时间做比较
 */
export function disabledDateTime(current: any, date: any) {
  console.log('disabledDateTime current', current)
  current = current || moment();
  const y = date.getFullYear();
  const M = date.getMonth();
  const d = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();

  if (
    current.year() > y ||
    (current.year() === y && current.month() > M) ||
    (current.year() === y && current.month() === M && current.date() > d)
  ) {
    h = 0;
    m = 0;
    s = 0;
  }
  if (
    current.year() === y &&
    current.month() === M &&
    current.date() === d &&
    current.hour() > h
  ) {
    m = 0;
    s = 0;
  }
  if (
    current.year() === y &&
    current.month() === M &&
    current.date() === d &&
    current.hour() === h &&
    current.minute() > m
  ) {
    s = 0;
  }
  return {
    disabledHours: () => range(0, h),
    disabledMinutes: () => range(0, m),
    disabledSeconds: () => range(0, s),
  };
}
