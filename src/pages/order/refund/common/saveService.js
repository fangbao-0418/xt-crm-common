import { gotoPage } from '@/util/utils'
import { ossUpload } from '@/components/upload'

function saveService (data, isServiceCenter) {
  if (isServiceCenter === 'isServiceCenter') {
    console.log('sort===')
    for (let i = 0; i < data.applicationQuestion.length - 1; i++) {
      //确定轮数
      for (let j = 0; j < data.applicationQuestion.length - i - 1; j++) {
        //确定每次比较的次数
        if (data.applicationQuestion[j].mainProblemSort > data.applicationQuestion[j + 1].mainProblemSort) {
          const tem = data.applicationQuestion[j]
          data.applicationQuestion[j] = data.applicationQuestion[j + 1]
          data.applicationQuestion[j + 1] = tem
        }
      }
    }
    for (let m = 0; m < data.applicationQuestion.length - 1; m++) {
      const question = data.applicationQuestion[m].question
      console.log(question, 'question====')
      for (let i = 0; i < question.length - 1; i++) {
        //确定轮数
        for (let j = 0; j < question.length - i - 1; j++) {
          //确定每次比较的次数
          if (question[j].sort > question[j + 1].sort) {
            const tem = question[j]
            question[j] = question[j + 1]
            question[j + 1] = tem
          }
        }
      }
    }
  }
  const orign = window.location.origin
  const saveData = JSON.stringify(data)
  const file = new File([saveData], 'service')
  const path = orign.includes('//xt-crmadmin.hzxituan.com') ? '/question-prod.json' : '/question-test.json'

  ossUpload(file, 'question', 'cos', path).then((res) => {
    if (res) {
      APP.success('保存成功')
      isServiceCenter && gotoPage('/order/servicecenter')
    }
  })
}
export default saveService