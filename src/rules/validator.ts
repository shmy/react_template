const baseRegValidator = (pattern: RegExp) => {
  return field => {
    return (rule, value, callback) => {
      if (!pattern.test(value)) {
        callback(new Error(field + "格式不正确"));
        return;
      }
      callback();
    };
  };
};
// 用户名验证
export const usernameValidator = baseRegValidator(/^[a-zA-Z0-9]{1,}$/);
// 手机号验证
export const phoneValidator = baseRegValidator(/^1\d{10}$/);
// url验证
export const urlValidator = baseRegValidator(/^https?:\/\/.+/);
// 金额验证
export const amountValidator = baseRegValidator(/^\d+(\.\d{1,2})?$/);
// 身份证验证
export const idCardValidator = baseRegValidator(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/);
// 邮箱地址验证
export const emailValidator = baseRegValidator(/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/);
