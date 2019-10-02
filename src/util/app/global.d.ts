declare module APP {
  interface History {
    push: (url: string) => void
  }
  interface ReduxActionProps<T = any> {
    type: string,
    payload?: T
  }
  interface HttpProps {
    get: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
    newPost: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
    newPut: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>
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