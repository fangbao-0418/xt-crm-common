
import { getStsPolicy, getStsCos } from './api'
import { createClient, ossUploadBlob, createCosClient, cosUpload } from './oss.js'

type OssType = 'oss' | 'cos'

export async function ossUpload (file: File, dir = 'crm', ossType: OssType = 'oss', specifiedAddress?: string) {
  if (ossType === 'oss') {
    const res = await getStsPolicy()
    if (res) {
      const client = createClient(res)
      try {
        const urlList = await ossUploadBlob(client, file, dir)
        return urlList
      } catch (error) {
        // message.error('上传失败，请重试', 'middle')
        return Promise.reject(error)
      }
    } else {
      return Promise.reject()
    }
  } else if (ossType === 'cos') {
    const stsCos = await getStsCos()
    if (stsCos) {
      const cosClient = createCosClient(stsCos)
      try {
        const address = await cosUpload(cosClient, file, dir, stsCos, specifiedAddress)
        const url = 'https://' + address.Location
        const urlList = [url]
        return urlList
      } catch (error) {
        // message.error('上传失败，请重试', 'middle')
        return Promise.reject(error)
      }
    } else {
      return Promise.reject()
    }
  }
}

export function getStorageUnit (bit: number) {
  let value = bit
  let unit = '字节'
  if (bit < 1024) {
    value = bit
  } else if (bit < 1024 * 1024) {
    value = bit / (1024 * 1024)
    unit = 'MB'
  }
  return value + unit
}