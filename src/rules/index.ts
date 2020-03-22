import {
  amountValidator,
  emailValidator,
  idCardValidator,
  phoneValidator,
  urlValidator,
  usernameValidator
} from "@/rules/validator";

const getOptionalRule = (fn: Function) => {
  return {
    validator: (rule, value, callback) => {
      if (!value) {
        callback();
        return;
      }
      fn(rule, value, callback);
    }
  };
};

export const getRequiredRule = (field, input = true) => {
  return {required: true, message: "请" + (input ? "输入" : "选择") + field};
};
export const getUserNameRule = field => {
  return {validator: usernameValidator(field)};
};
export const getUrlRule = field => {
  return {validator: urlValidator(field)};
};
export const getUrlOptionalRule = field => {
  return getOptionalRule(urlValidator(field));
};

export const getPhoneRule = field => {
  return {validator: phoneValidator(field)};
};

export const getPhoneOptionalRule = field => {
  return getOptionalRule(phoneValidator(field));
};

export const getIdCardRule = field => {
  return {validator: idCardValidator(field)};
};

export const getIdCardOptionalRule = field => {
  return getOptionalRule(idCardValidator(field));
};

export const getAmountRule = field => {
  return {validator: amountValidator(field)};
};

export const getAmountOptionalRule = field => {
  return getOptionalRule(amountValidator(field));
};

export const getEmailRule = field => {
  return {validator: emailValidator(field)};
};

export const getEmailOptionalRule = field => {
  return getOptionalRule(emailValidator(field));
};
