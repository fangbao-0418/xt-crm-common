interface FnProps {
  /** 获取h5域名 */
  getH5Origin: () => string
  /** 处理loading 默认参数loadind=end */
  handleLoading: (status?: 'start' | 'end') => void
}