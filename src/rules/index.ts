import getUrlValidator from "./url";
import getPhoneValidator from "./phone";
import getIdCardValidator from "./id-card";
import getAmountValidator from "./amount";

export const getRequiredRule = (field, input = true) => {
  return { required: true, message: "请" + (input ? "输入" : "选择") + field};
};
export const getUrlRule = field => {
  return { validator: getUrlValidator(field)};
};
export const getPhoneRule = field => {
  return { validator: getPhoneValidator(field)};
};
export const getIdCardRule = field => {
  return { validator: getIdCardValidator(field)};
};
export const getAmountRule = field => {
  return { validator: getAmountValidator(field, true)};
};
export const getAmountRuleWithOutRequired = field => {
  return { validator: getAmountValidator(field, false)};
};

