/* eslint-disable @typescript-eslint/ban-ts-comment */
import { generateDate } from '../generateDate';

describe('generateDate', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2025, 4, 17, 14, 30, 45)); // 2025-05-17T14:30:45
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return current date in default format (YYYY-MM-DD)', () => {
    const result = generateDate({});
    expect(result).toBe('2025-05-17');
  });

  test('should accept a timestamp and format it correctly', () => {
    const timestamp = new Date(2023, 0, 1, 12, 30, 45).getTime(); // 2023-01-01T12:30:45
    const result = generateDate({
      date: timestamp,
      format: 'YYYY/MM/DD hh:mm:ss',
    });
    expect(result).toBe('2023/01/01 12:30:45');
  });

  test('should accept a Date object and format it correctly', () => {
    const date = new Date(2020, 11, 31, 23, 59, 59); // 2020-12-31T23:59:59
    const result = generateDate({
      date,
      format: 'YYYY年MM月DD日 hh时mm分ss秒',
    });
    expect(result).toBe('2020年12月31日 23时59分59秒');
  });

  test('should throw TypeError for invalid date input', () => {
    // @ts-ignore
    expect(() => generateDate({ date: 'invalid' })).toThrow(TypeError);
    // @ts-ignore
    expect(() => generateDate({ date: NaN })).toThrow(TypeError);
    // @ts-ignore
    expect(() => generateDate({ date: {} })).toThrow(TypeError);
  });

  test('should support various formats', () => {
    const result1 = generateDate({ format: 'YYYY-MM-DD' });
    expect(result1).toBe('2025-05-17');

    const result2 = generateDate({ format: 'YYYY/MM/DD hh:mm:ss' });
    expect(result2).toBe('2025/05/17 14:30:45');

    const result3 = generateDate({ format: 'hh:mm' });
    expect(result3).toBe('14:30');

    const result4 = generateDate({ format: 'MM-DD-YYYY' });
    expect(result4).toBe('05-17-2025');
  });

  test('should pad with leading zeros for single-digit values', () => {
    jest.useFakeTimers().setSystemTime(new Date(2025, 0, 5, 3, 8, 9)); // 2025-01-05T03:08:09

    const result = generateDate({ format: 'YYYY-MM-DD hh:mm:ss' });
    expect(result).toBe('2025-01-05 03:08:09');
  });
});
