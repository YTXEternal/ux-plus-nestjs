/**
 * 用于生成账户注册所需的验证码
 *
 * @returns {string}
 */
export const generateCode = () => {
  let code = '';
  for (let i = 0; i < 6; i++) {
    const digit = Math.floor(Math.random() * 10);
    code += digit;
  }
  return code;
};
