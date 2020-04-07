export function getUrl(url: string) {
  if (!url) return url
  url = /^http/.test(url) ? url : `https://assets.hzxituan.com/${url}`
  return url
}