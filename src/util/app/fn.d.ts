interface FnProps {
  /** 获取h5域名 */
  getH5Origin: () => string
  /** 格式化日期 */
  formatDate: (date: string | number, format?: string) => string
  /** 格式化金额 */
  formatMoney: (money: any) => string
  /** 处理loading 默认参数loadind=end */
  handleLoading: (status?: 'start' | 'end') => void
}