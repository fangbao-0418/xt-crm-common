interface HttpProps {
  get: <T = any>(url: string, data?: any, config?: any) => Promise<T>
  post: <T = any>(url: string, data?: any, config?: any) => Promise<T>
  newPost: <T = any>(url: string, data?: any, config?: any) => Promise<T>
  del:  <T = any>(url: string, data?: any, config?: any) => Promise<T>
  newPost: <T = any>(url: string, data?: any, config?: any) => Promise<T>
  newPut: <T = any>(url: string, data?: any, config?: any) => Promise<T>
}