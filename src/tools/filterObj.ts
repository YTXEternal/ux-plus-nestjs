import { objFor } from './objFor';
export const filterObj = <T extends Record<string, any>>(
  obj: T,
  cb: (key: keyof T, el: T[keyof T]) => boolean,
) => {
  const o: Record<string, any> = {};
  objFor(obj, (key, el) => {
    const is = cb(key, el);
    if (!is) return;
    o[key] = el;
  });
  return o;
};
