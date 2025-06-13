import { generateId } from '../generateId';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('generateId', () => {
  test('should return a string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
  });

  test('should return a valid UUID v4 string', () => {
    const id = generateId();
    expect(id).toMatch(UUID_V4_REGEX);
  });

  test('should generate different IDs on each call', () => {
    const id1 = generateId();
    const id2 = generateId();

    expect(id1).not.toBe(id2);
  });

  test('should generate multiple valid UUIDs', () => {
    for (let i = 0; i < 100; i++) {
      const id = generateId();
      expect(id).toMatch(UUID_V4_REGEX);
    }
  });
});
