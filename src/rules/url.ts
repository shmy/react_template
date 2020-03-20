let regExp = /^https?:\/\/.+/;
export default field => {
  return (rule, value, callback) => {
    if (!regExp.test(value)) {
      callback(new Error(field + "格式不正确"));
      return;
    }
    callback();
  };
};
