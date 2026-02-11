
import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../lib/utils';

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('test.user@example.com')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
    expect(isValidEmail('user@subdomain.example.com')).toBe(true);
  });

  it('should return false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('test')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('test@example')).toBe(false); // Depending on regex, this might be valid for local domains, but usually false for public
    expect(isValidEmail('test@example.')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
  });
});
