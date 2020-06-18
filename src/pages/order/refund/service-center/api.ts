const { post, get, newPost, newPut, del } = APP.http
import { handleApiUrl } from '@/util/app/config'
export const getAnchorList = (payload: any) => {
  return get('::ulive/live/anchor/list', payload)
}
/** 获取用户信息 */
export const fetchUserInfo = (payload: {
  memberId?: number
  phone?: string
}) => {
  return Promise.all<any, any>([get('::ulive/live/anchor/member', payload), get('/member/simple', payload)])
}

/** 添加主播 */
export const addAnchor = (payload: Partial<Anchor.ItemProps>) => {
  return newPost('::ulive/live/anchor/save', payload)
}

/** 自提点模糊搜索 */
export const searchPoints = (keyWords:any) => {
  return get(`/point/list?name=${keyWords}`)
}
/** 批量添加主播 */
export const multiAddAnchor = (payload: {
  /** 主播身份(20-供应商, 30-网红主播, 40-买家) */
  anchorIdentityType: 20 | 30 | 40
  /** 主播等级(0-普通主播, 10-星级主播) */
  anchorLevel: 0 | 10,
  users: {memberId: any, headUrl: string, nickName: string, phone: string}[]
}) => {
  return newPost('::ulive/live/anchor/save/batch', payload)
}

/** 删除主播 */
export const deleteAnchor = (id: number) => {
  return del(`::ulive/live/anchor/${id}`)
}

/** 主播状态修改(拉黑/不拉黑) */
export const updateAnchorStatus = (payload: {
  anchorId: number
  status: 0 | 1
}) => {
  return newPut('::ulive/live/anchor/status/update', payload)
}

export const updateAnchor = (payload: {
  anchorId: number
  anchorIdentityType: Anchor.AnchorIdentityType
  anchorLevel: 0 | 10
}) => {
  return newPut('::ulive/live/anchor/update', payload)
}

/** 校验手机号 */
export const checkPhoneList = (phoneList: string) => {
  return newPost<{
    validUsers: {phone: string, id: number}[],
    inValidPhone: string[]
  }>('/member/check', {
    phoneList
  })
}

/** 批量新增主播手机号校验 */
export const checkMultiAnchorPhone = (phoneList: string[]) => {
  return newPost('::ulive/live/anchor/save/batch/validate', phoneList)
}

/** 批量新增主播错误信息导出 */
export const exportMultiAddErrorInfo = (payload: {
  /** 错误编码(0-手机号错误, 1-已存在, 2-已拉黑, 3-非会员) */
  errorCode: 0 | 1 | 2 | 3
  phone: string
}[]) => {
  return fetch(handleApiUrl('::ulive/live/anchor/save/batch/export'), {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {
      'content-type': 'application/json',
      authorization: JSON.parse(localStorage.getItem('token') || '')
    }
  }).then((res) => {
    const resClone = res.clone()
    return resClone.json().then((res2) => {
      if (!res2.success) {
        APP.error(res2.message)
      } else {
        APP.error('导出失败')
      }
      return Promise.reject(res2)
    }, (err) => {
      return res
    })
  }).then((res) => {
    res.blob().then((excelBlob) => {
      const el = document.createElement('a')
      el.href = URL.createObjectURL(excelBlob)
      el.download = '主播批量新增异常数据.xlsx'
      el.click()
    })
  })
}

/** 获取小程序微信太阳码 */
export const getWxQrcode = (payload: {
  host?: string
  linkUrl?: string
  page: string
  scene: string
}) => {
  return newPost('::ulive/live/plan/code', payload)
}