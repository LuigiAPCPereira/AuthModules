export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Security: Centralized password policy to ensure consistency across UI and validation schemas
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
export const PASSWORD_NUMBER_REGEX = /\d/;
export const PASSWORD_SPECIAL_REGEX = /[^A-Za-z0-9]/;

// Reconstructed for backward compatibility and usage in simple checks
export const STRONG_PASSWORD_REGEX = new RegExp(
  `^(?=.*${PASSWORD_LOWERCASE_REGEX.source})(?=.*${PASSWORD_UPPERCASE_REGEX.source})(?=.*${PASSWORD_NUMBER_REGEX.source})(?=.*${PASSWORD_SPECIAL_REGEX.source}).{${PASSWORD_MIN_LENGTH},}$`
);
