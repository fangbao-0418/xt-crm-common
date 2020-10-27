import { initImgList } from '@/util/utils'
import BraftEditor from 'braft-editor'

// 适配发布文章入参
export function adapterArticleParams (payload: any) {
  if (payload.contextType === '1') {
    payload.context = payload.context?.toHTML?.()
  }
  
  if (payload.coverImage) {
    payload.coverImage = payload.coverImage.map((item: any) => APP.fn.deleteOssDomainUrl(item.url)).join(',')
  }
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
    const audioMimeTypes = ['audio/mpeg', 'audio/x-mpeg', 'audio/mp3']
    if (videoMimeTypes.includes(file.type)) {
      payload.resourceType = 1
    }
    else if (audioMimeTypes.includes(file.type)) {
      payload.resourceType = 2
    }
    // 编辑情况下
    if (file.resourceType) {
      payload.resourceType = file.resourceType
    }
    console.log('file.type', file.type)
    payload.fileSize = file.size
    payload.resourceUrl = file.url
  } else {
    payload.resourceUrl = ''
  }
  payload.shareStatus = payload.shareStatus ?  1 : 2
  if (!payload.releaseTime) {
    payload.releaseTime = Date.now()
  }
  return payload
}

function string2Arr (str: string) {
  return (str || '').split(',').reduce((prev: any[], curr: any) => prev.concat(initImgList(curr)), [])
}

export function adapterArticleResponse (res: any) {
  res.coverImage = string2Arr(res.coverImage)
  res.resourceUrl = string2Arr(res.resourceUrl).map(v => ({ ...v, resourceType: res.resourceType }))
  // 富文本 contextType: 1、富文本 2、链接
  if (res.contextType === '1') {
    res.context = BraftEditor.createEditorState(res.context)
  }
  res.shareStatus = res.shareStatus === 1
  return res
}