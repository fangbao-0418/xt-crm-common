import { initImgList } from '@/util/utils'

export interface Payload {
  isOpen: 0 | 1,
  shareBackground: any[],
  shareInstructions: any[],
  shareIcon: any[],
  livePlanId: number
}

function getUrl (arr: any[] = []) {
  let url = arr.map(v => v.url)[0]
  url = APP.fn.deleteOssDomainUrl(url)
  return url
}

export function formRequest(req: Payload) {
  return {
    ...req,
    shareBackground: getUrl(req.shareBackground),
    shareInstructions: getUrl(req.shareInstructions),
    shareIcon: getUrl(req.shareIcon)
  }
}

export function formResponse(res: any) {
  res.shareBackground = initImgList(res.shareBackground)
  res.shareInstructions = initImgList(res.shareInstructions)
  res.shareIcon = initImgList(res.shareIcon)
  return res;
}