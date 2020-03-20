let regExp = /^\d+(\.\d{1,2})?$/;
export default (field, required = true) => {
  return (rule, value, callback) => {
    if (!required) {
      if (!value) {
        callback();
        return;
      }
    }
    if (!regExp.test(value)) {
      callback(new Error(field + "格式不正确"));
      return;
    }
    callback();
  };
};
