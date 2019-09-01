declare module APP {
  interface History {
    push: (url: string) => void
  }
  export var history: History
}