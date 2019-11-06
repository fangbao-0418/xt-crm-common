interface FnProps {
  /** 获取h5域名 */
  getH5Origin: () => string
  /** 处理loading 默认参数loadind=end */
  handleLoading: (status?: 'start' | 'end') => void
  /** 获取localStorage payload 值 */
  getPayload: <T = any>(namespace: string) => T
  /** 设置localStorage payload 值 */
  setPayload: <T = any>(namespace: string, value: T) => void
  fieldConvert: (obj: object, field: object) => any
  formatDate: (date: string | number, format?: string) => string
  formatMoney: (money: any) => string
  download: (url: string, name: string) => void
}