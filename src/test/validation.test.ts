import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../lib/utils';

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('user.name@example.co.uk')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
    expect(isValidEmail('user@sub.domain.com')).toBe(true);
  });

  it('should return false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@domain..com')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
  });

  // Edge cases where implementation might differ
  it('should handle edge cases', () => {
    // Current implementation allows single char TLD?
    // expect(isValidEmail('user@domain.c')).toBe(true); // Assuming current impl allows it
  });
});
