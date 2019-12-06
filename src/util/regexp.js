/**
 * 支持 15 位和 18 位身份证号，支持地址编码、出生日期、校验位验证
 * https://www.cnblogs.com/xtqg0304/p/9529721.html
 */
export const idcardReg = /^[1-9][0-9]{13, 16}([0-9]|Z|X)$/