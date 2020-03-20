let regExp = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;

export default field => {
  return (rule, value, callback) => {
    if (!regExp.test(value)) {
      callback(new Error(field + "格式不正确"));
      return;
    }
    callback();
  };
};
