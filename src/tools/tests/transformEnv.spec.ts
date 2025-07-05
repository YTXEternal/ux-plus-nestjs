import { toNumber, toBoolean, toObject } from '../transformEnv';

describe('toNumber', () => {
  test('should convert string to number', () => {
    expect(toNumber('123')).toBe(123);
    expect(toNumber('-456')).toBe(-456);
    expect(toNumber('3.14')).toBe(3.14);
  });
});

describe('toBoolean', () => {
  test('should convert "true" to true', () => {
    expect(toBoolean('true')).toBe(true);
  });

  test('should convert "false" to false', () => {
    expect(toBoolean('false')).toBe(false);
  });

  test('should return false for other values', () => {
    expect(toBoolean('')).toBe(false);
    expect(toBoolean('1')).toBe(false);
    expect(toBoolean('0')).toBe(false);
    expect(toBoolean('yes')).toBe(false);
    expect(toBoolean('no')).toBe(false);
  });
});

describe('toObject', () => {
  test('should parse valid JSON string into object', () => {
    const result = toObject<{ name: string; age: number }>(
      '{"name":"Alice","age":25}',
    );
    expect(result).toEqual({ name: 'Alice', age: 25 });
  });

  test('should throw error on invalid JSON', () => {
    expect(() => toObject('invalid json')).toThrow();
    expect(() => toObject('{name: "Alice"}')).toThrow();
  });
});
