export const fetchQuestion = () => {
  const env = process.env.PUB_ENV

  const path = `https://sh-tximg.hzxituan.com/question/question-${env}.json?v=${new Date().getTime()}`
  return fetch(path).then((res) => {
    return res.json()
  })
}