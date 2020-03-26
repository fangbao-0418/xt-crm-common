// https://test-rlcas.hzxituan.com/
// https://rlcas.hzxituan.com/
(function (a, b) {
  a.Moon = {
    oper: function () {
      console.log(window.Moon, 'oper')
    },
    error: function () {
      console.log(window.Moon, 'error')
    }
  }
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
    if (Moon) {
      console.log(Moon, 'onload')
      APP.moon.error = function (error) {
        if (error instanceof Object) {
          error = JSON.stringify(error)
        }
        Moon.error(new Error(error))
      }
      APP.moon.oper = function () {
        console.log(arguments, 'oper arguments')
        try {
          Moon.oper.apply(null, arguments)
        } catch (e) {
          Moon.error(e)
          // throw Error(e)
        }
      }
    }
  }
  m.src = "https://cdn.hzxituan.com/npm/moon/v1.0.3/moon.js";
  var c = b.getElementsByTagName("script")[0];
  c.parentNode.insertBefore(m, c);
})(window, document);