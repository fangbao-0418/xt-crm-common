declare module APP {
  interface History {
    push: (url: string) => void
  }
  interface ReduxActionProps<T = any> {
    type: string,
    payload?: T
  }
  interface HttpProps {
    get: (url: string, data?: any, config?: AxiosRequestConfig) => AxiosPromise<any>
    post: (url: string, data?: any, config?: AxiosRequestConfig) => AxiosPromise<any>
    newPost: (url: string, data?: any, config?: AxiosRequestConfig) => AxiosPromise<any>
    newPut: (url: string, data?: any, config?: AxiosRequestConfig) => AxiosPromise<any>
  }
  interface FnProps {
    getH5Origin: () => string
    /** 格式化日期 */
    formatDate: (date: string | number, format?: string) => string
    /** 格式化金额 */
    formatMoney: (money: any) => string
  }
  type DispatchProps = (action: ReduxActionProps) => void
  export var history: History
  export var dispatch: DispatchProps
  export const success: (text: string, duration?: number) => void
  export const error: (text: string, duration?: number) => void
  export const http: HttpProps
  export const fn: FnProps
}