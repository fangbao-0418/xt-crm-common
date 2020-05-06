export function lockedListResponse(res: any) {
  const records = (res.records || []).map((v: any) => {
    v=v||{}
    v.createTimeText = APP.fn.formatDate(v.createTime);
    return v;
  });
  return { ...res, records }
}
