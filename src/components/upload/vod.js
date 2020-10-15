// 腾讯云点播Web端上传

function getSignature() {
  return axios.post(url).then(function (response) {
    return response.data.signature;
  })
}