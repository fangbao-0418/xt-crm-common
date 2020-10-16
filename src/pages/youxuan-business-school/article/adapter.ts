import { initImgList } from '@/util/utils'
import BraftEditor from 'braft-editor'

// 适配发布文章入参
export function adapterArticleParams (payload: any) {
  const context = payload.context?.toHTML()
  payload.coverImage = payload.coverImage.map((item: any) => APP.fn.deleteOssDomainUrl(item.url)).join(',')
  if (payload.resourceUrl && payload.resourceUrl.length > 0) {
    const file = payload.resourceUrl[0]
    /**
     * 视频类
     * .mkv video/x-matroska
     * .mp4 video/mp4
     * .avi video/x-msvideo
     * 音频类
     * .mp3 audio/mpeg
     */
    const videoMimeTypes = ['video/x-matroska', 'video/mp4', 'video/x-msvideo']
    const audioMimeTypes = ['audio/mpeg']
    if (videoMimeTypes.includes(file.type)) {
      payload.resourceType = 1
    }
    else if (audioMimeTypes.includes(file.type)) {
      payload.resourceType = 2
    }
    payload.shareStatus = payload.shareStatus ?  1 : 2
    payload.fileSize = file.size
    payload.resourceUrl = file.url
  }
  if (!payload.releaseTime) {
    payload.releaseTime = Date.now()
  }
  return { ...payload, context }
}

function string2Arr (str: string) {
  return (str || '').split(',').reduce((prev: any[], curr: any) => prev.concat(initImgList(curr)), [])
}

export function adapterArticleResponse (res: any) {
  res.coverImage = string2Arr(res.coverImage)
  res.resourceUrl = string2Arr(res.resourceUrl)
  res.context = BraftEditor.createEditorState(res.context)
  return res
}