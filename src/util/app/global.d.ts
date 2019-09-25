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
  }
  interface FnProps {
    getH5Origin
  }
  type DispatchProps = (action: ReduxActionProps) => void
  export var history: History
  export var dispatch: DispatchProps
  export const success: (text: string, duration?: number) => void
  export const error: (text: string, duration?: number) => void
  export const http: HttpProps
  export const fn: FnProps
}