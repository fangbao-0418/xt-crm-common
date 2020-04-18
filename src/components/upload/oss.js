/**@/utils/oss.js**/
import OSS from 'ali-oss';
import COS from 'cos-js-sdk-v5'

const sha256 = require('hash.js/lib/hash/sha/256');

export const splitFileName = text => {
  // eslint-disable-next-line
  let pattern = /\.[^\.]+$/; // 正则
  let name = text; // 名称
  let suffix = ''; // 后缀
  if (pattern.exec(text) !== null) {
    name = text.slice(0, pattern.exec(text).index);
    suffix = text.slice(pattern.exec(text).index);
  }
  return {
    name,
    suffix,
  };
};

// 生成 ossClient
export const createClient = ossPolicy => {
  return new OSS({
    accessKeyId: ossPolicy.accessKeyId,
    accessKeySecret: ossPolicy.accessKeySecret,
    stsToken: ossPolicy.securityToken,
    endpoint: ossPolicy.endpoint,
    bucket: ossPolicy.bucket,
  });
};

// 生成 cosClient, 腾讯云实例
export const createCosClient = cosPolicy => {
  return new COS({
    getAuthorization: function (options, callback) {
      const { credentials } = cosPolicy
      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        XCosSecurityToken: credentials.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: cosPolicy.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: cosPolicy.expiredTime // 时间戳，单位秒，如：1580000900
      })
    }
  })
};

// 上传Blob数据
export const ossUploadBlob = async (client, blob, path) => {
  try {
    const uniqueid =
      sha256()
        .update(blob)
        .digest('hex') + Date.now();
    const { suffix } = splitFileName(blob.name);
    const key = `${path}/${uniqueid}${suffix}`;
    // const res = await client.multipartUpload(key, blob);
    const res = await client.put(
      key,
      blob,
      // , { type: 'text/plain' }
    );
    // console.log(res, 'upload res');
    return Promise.resolve(res.res.requestUrls);
  } catch (error) {
    return Promise.reject(error);
  }
};

/** 腾讯云图片上传 */
export const cosUpload = (cosClient, file, path) => {
  const uniqueid =
      sha256()
        .update(file)
        .digest('hex') + Date.now();
  const { suffix } = splitFileName(file.name);
  return new Promise((resolve, reject) => {
    cosClient.putObject({
      Bucket: 'sh-tximg-1300503753', /* 必须 */
      Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
      Key: `tximg/${path}/${uniqueid}${suffix}`, /* 必须 */
      StorageClass: 'STANDARD',
      Body: file, // 上传文件对象
      onProgress: function (progressData) {
        console.log(JSON.stringify(progressData), 'progressData')
      }
    }, function (err, data) {
      data && resolve(data)
      err && reject(err)
    })
  })
}
