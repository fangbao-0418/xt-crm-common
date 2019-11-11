interface PageProps<T> {
  current?: number
  total?: number
  size?: number
  page?: number
  searchCount?: boolean
  /** 总页数 */
  pages?: number
  records: T[]
}