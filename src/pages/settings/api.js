import * as Fetch from '@/util/fetch';

// 发送验证码
export function sendCode(params) {
  return Fetch.post('/user/sendVerifyCode', params);
}

// 发送验证码
export function changePassword(params) {
  return Fetch.post('/user/updatePassword', params);
}

export function logout() {
  return Fetch.request('/logout');
}
