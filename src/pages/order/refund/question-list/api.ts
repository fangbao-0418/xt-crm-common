export const fetchQuestion = () => {
  const orign = window.location.origin

  const path = orign.includes('//xt-crmadmin.hzxituan.com') ? 'https://sh-tximg-1300503753.cos.ap-shanghai.myqcloud.com/question/question-prod.json' : 'https://sh-tximg-1300503753.cos.ap-shanghai.myqcloud.com/question/question-test.json'
  return fetch(path).then((res) => {
    return res.json()
  })
}