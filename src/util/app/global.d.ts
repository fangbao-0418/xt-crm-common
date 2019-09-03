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
}