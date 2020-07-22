(function (a, b) {
  const env = process.env.PUB_ENV
  a._moon_ = {
    mid: 'jw0pzj9nh',
    domain: env !== 'prod' ? 'https://test-rlcas.hzxituan.com' : 'https://rlcas.hzxituan.com',
    file: [],
    env,
    reqType: 'http',
    spa: true
  }
  // const m = b.createElement('script')
  // m.async = true
  // m.onload = function () {
  // }
  // m.src = 'https://cdn.hzxituan.com/npm/moon/v3.0.0/h5-moon.js'
  // const c = b.getElementsByTagName('script')[0]
  // c.parentNode.insertBefore(m, c)
})(window, document)