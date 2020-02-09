import { SprinkleCashFormProps } from "./form";
import moment from 'moment';

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
  const result: any = {}
  // 元转分
  result.awardValue = APP.fn.formatMoneyNumber(payload.awardValue);
  const [ startTime, endTime ] = payload.activityDate.map(m => m && m.valueOf());
  result.startTime = startTime;
  result.endTime = endTime;
  return { ...payload, ...result };
}
// 过滤详情接口
export function detailResponse(res: any) {
  // 分转元
  res.awardValue = APP.fn.formatMoneyNumber(res.awardValue, 'm2u');
  res.activityDate = [res.startTime ? moment(res.startTime) : null, res.endTime ? moment(res.endTime): null];
  return res;
}