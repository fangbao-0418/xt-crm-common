/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-12 15:43:57
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/util/app/global.d.ts
 */
/// <reference path="./http.d.ts"  />
/// <reference path="./fn.d.ts"  />
/// <reference path="./constant.d.ts"  />
declare module APP {
  interface History {
    goBack()
    push: (url: string) => void
    go: (url: string | number) => void
    replace: (url: string) => void
  }
  interface ReduxActionProps<T = any> {
    type: string,
    payload?: T
  }
  type DispatchProps = (action: ReduxActionProps) => void
  export let history: History
  export let dispatch: DispatchProps
  export const success: (text: string, duration?: number) => void
  export const error: (text: string, duration?: number) => void
  export const http: HttpProps
  export const fn: FnProps
  export const constant: constantProps
  export const href: (url: string, target?: '_blank' | '_self' | '_parent' | '_top' | string) => void
  export const open: (url: string) => void
  /** 正则校验 */
  export const regular: {
    /** 手机号校验 */
    phone: RegExp
  }
  export const moon: {
    logApi: (data: any) => void
    oper: (response: any, status?: any) => void
    error: (error: any) => void
    /**
     * 埋点日志
     * param {*} data - 埋点数据
     * param ('') label - 标签
     * */
    logger: (data, label?: LoggerLabel) => void
  }
  export const user: {
    id: number
    username: string
    realname: string
    phone: string
    /** 当前权限code */
    menuGathers: string[]
  }
}
