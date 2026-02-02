/**
 * 生成随机用户名
 *
 * @returns {string}
 */
export const generateNickName = () => {
  const handle = (n: number) => (n > 10 ? n + '' : '0' + n);
  const prefix = 'ux';
  const tag = '@';
  const date = new Date();
  const year = date.getFullYear() + '';
  const mounth = handle(date.getMonth() + 1);
  const day = handle(date.getDate());
  const millisecond = date.getMilliseconds();
  const name = year + mounth + day + millisecond;
  return `${prefix}${tag}${name}`;
};
