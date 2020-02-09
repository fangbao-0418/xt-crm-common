import { SprinkleCashFormProps } from "./form";


// 过滤分页接口
export function listResponse(res: any) {
  res.records = res.records.map((record: any) => {
    const startTimeStr = APP.fn.formatDate(record.startTime);
    const endTimeStr = APP.fn.formatDate(record.endTime)
    record.activityDate = startTimeStr + '~\n' + endTimeStr;
    record.awardValue = APP.fn.formatMoneyNumber(record.awardValue, 'm2u');
    record.rule = record.rule.split(/↵|\n/).join('<br/>')
    return record;
  })
  return res;
}

// 过滤新增、编辑接口
export function requestPayload(payload: SprinkleCashFormProps) {
  // 元转分
  payload.awardValue = APP.fn.formatMoneyNumber(payload.awardValue);
  return payload;
}
// 过滤详情接口
export function detailResponse(res: any) {
  // 分转元
  res.awardValue = APP.fn.formatMoneyNumber(res.awardValue, 'm2u');
  return res;
}