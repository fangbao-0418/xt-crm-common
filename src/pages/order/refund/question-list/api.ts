export const fetchQuestion = () => {
  return fetch('https://sh-tximg-1300503753.cos.ap-shanghai.myqcloud.com/question/question-pro.json').then((res) => {
    return res.json()
  })
}