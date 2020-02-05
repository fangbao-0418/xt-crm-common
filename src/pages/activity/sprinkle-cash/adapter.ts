// 过滤分页接口
export function listResponse(res: any) {
  res.records = res.records.map((record: any) => {
    const startTimeStr = APP.fn.formatDate(record.startTime);
    const endTimeStr = APP.fn.formatDate(record.endTime)
    record.activityDate = startTimeStr + '~' + endTimeStr;
    return record;
  })
  return res;
}