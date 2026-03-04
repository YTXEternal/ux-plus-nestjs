import { filterObj } from './filterObj';

export const filterObjNull = <T>(obj: T): T => {
  return filterObj(obj as Record<string, any>, (key, el) => {
    return el !== null && el !== undefined;
  }) as unknown as T;
};
