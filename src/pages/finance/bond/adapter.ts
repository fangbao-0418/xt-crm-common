import omit from 'lodash/omit'

function list2Records (res: any) {
  res.records = res.list
  return omit(res, 'list')
}
export function listResponse (res: any) {
  return list2Records(res)
}

export function RecordsResponse (res: any) {
  res.list = (res.list || []).map((item: any) => {
    item.submitTime = item.startTime + '~' + item.endTime
    return item
  })
  return list2Records(res)
}