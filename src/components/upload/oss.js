/**@/utils/oss.js**/
import OSS from 'ali-oss';
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
