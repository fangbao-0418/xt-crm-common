/*
 * @Date: 2020-03-16 14:01:18
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-26 15:56:12
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/util/app/global.d.ts
 */
/// <reference path="./http.d.ts"  />
/// <reference path="./fn.d.ts"  />
/// <reference path="./constant.d.ts"  />
declare module APP {
  interface History {
    push: (url: string) => void
    go: (url: string | number) => void
  }
  interface ReduxActionProps<T = any> {
    type: string,
    payload?: T
  }
  type DispatchProps = (action: ReduxActionProps) => void
  export var history: History
  export var dispatch: DispatchProps
  export const success: (text: string, duration?: number) => void
  export const error: (text: string, duration?: number) => void
  export const http: HttpProps
  export const fn: FnProps
  export const constant: constantProps
  export const href: (url: string, target?: '_blank' | '_self' | '_parent' | '_top' | string) => void
  /** 正则校验 */
  export const regular: {
    /** 手机号校验 */
    phone: RegExp
  }
  export const moon: {
    oper: (response: any, status?: any) => void
    error: (error: any) => void
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
