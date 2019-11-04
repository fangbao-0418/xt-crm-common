/// <reference path="./http.d.ts"  />
/// <reference path="./fn.d.ts"  />
declare module APP {
  interface History {
    push: (url: string) => void
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
  /** 正则校验 */
  export const regular: {
    /** 手机号校验 */
    phone: RegExp
  }
}