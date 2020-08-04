interface FnProps {
  /** 获取h5域名 */
  getH5Origin: () => string
  /** 格式化日期 */
  formatDate: (date: string | number | undefined, format?: string) => string
  /** 格式化金额 分转元 */
  formatMoney: (money: any) => string
  /** 处理loading 默认参数loadind=end */
  handleLoading: (status?: 'start' | 'end') => void
  /** 获取localStorage payload 值 */
  getPayload: <T = any>(namespace: string) => T
  /** 设置localStorage payload 值 */
  setPayload: <T = any>(namespace: string, value: T) => void
  fieldConvert: (obj: object, field: object) => any
  download: (url: string, name: string) => void
  /** 多个集合合并 */
  mutilCollectionCombine: (...arg: any[][]) => any[][]
  /** 后端金额转换，u2m|元转分，m2u|分转元；默认type = u2m */
  formatMoneyNumber: (money: number, type?: 'u2m' | 'm2u') => number
  round: (num: number, precision?: number) => void
  /** 去除oss资源路径 */
  deleteOssDomainUrl: (url: string) => string
  /** 补全oss资源路径 */
  fillOssDomainUrl: (url: string) => string
  /** 格式化危险字符串数据 */
  formatUnsafeString: (str: string) => string
  formatUnSafeData: <T = any>(data: T) => T
  wrapApi: (fn: any, empties?: any, value?: any) => any
  checkEmptyParams: (res: any, omits?: string[]) => any
}