/*
 * @Author: fangbao
 * @Date: 2020-03-27 19:49:47
 * @LastEditors: fangbao
 * @LastEditTime: 2020-03-31 10:28:50
 * @FilePath: /xt-new-mini/Users/fangbao/Documents/xituan/xt-crm/src/util/moon.js
 */
(function (a, b) {
  const env = process.env.PUB_ENV
  a._moon_ = {
    mid: "jw0pzj9nh",
    domain: env !== 'prod' ? 'https://test-rlcas.hzxituan.com' : 'https://rlcas.hzxituan.com',
    file: [],
    env,
    reqType: 'http',
    spa: true
  };
  var m = b.createElement("script");
  m.async = true;
  m.onload = function () {
    // if (Moon) {
    //   APP.moon.error = function (error) {
    //     if (error instanceof Error) {
    //       Moon.error(error)
    //       return
    //     }
    //     try {
    //       var tempError = new Error()
    //       tempError.name = 'Self Error'
    //       if (error instanceof Object) {
    //         var message = JSON.stringify(error)
    //         tempError.message = message
    //       } else {
    //         tempError.message = error
    //       }
    //       Moon.error(error)
    //     } catch (e) {
    //       Moon.error(e)
    //     }
    //   }
    //   APP.moon.oper = function () {
    //     try {
    //       Moon.oper.apply(null, arguments)
    //     } catch (e) {
    //       console.log(e, 'oper catch 1')
    //       /** 推送response错误日志 */
    //       try {
    //         var response = arguments[0]
    //         var message = ''
    //         try {
    //           message = JSON.stringify(response)
    //         } catch (e2) {
    //           message = response
    //         }
    //         var tempError = new Error(message)
    //         tempError.name = 'catch error'
    //         Moon.error(tempError)
    //       } catch (e2) {
    //         console.log(e, 'oper catch 2')
    //         Moon.error(e2)
    //       }
    //     }
    //   }
    // }
  }
  m.src = "https://cdn.hzxituan.com/npm/moon/v1.0.3/moon.js";
  var c = b.getElementsByTagName("script")[0];
  c.parentNode.insertBefore(m, c);
})(window, document);