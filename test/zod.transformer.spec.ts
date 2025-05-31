import { ValidationError } from '@/errors';
import { isZodError, fromZodError } from '@/transformers/zod.transformer';

describe('Zod Transformer', () => {
  describe('isZodError', () => {
    it('should return true for a valid Zod error object', () => {
      const zodError = {
        name: 'ZodError',
        errors: [
          {
            message: 'Required',
            path: ['email'],
            code: 'invalid_type',
          },
        ],
      };

      expect(isZodError(zodError)).toBe(true);
    });

    it('should return false for a non-Zod error object', () => {
      expect(isZodError(new Error('Regular error'))).toBe(false);
      expect(isZodError({ name: 'NotZodError' })).toBe(false);
      expect(isZodError({ name: 'ZodError', errors: 'not an array' })).toBe(false);
      expect(isZodError(null)).toBe(false);
      expect(isZodError(undefined)).toBe(false);
    });

    it('should return false if errors array contains invalid items', () => {
      const invalidZodError = {
        name: 'ZodError',
        errors: [
          { not_valid: true }, // Missing required properties
        ],
      };

      expect(isZodError(invalidZodError)).toBe(false);
    });
  });

  describe('fromZodError', () => {
    it('should transform a Zod error into a ValidationError', () => {
      const zodError = {
        name: 'ZodError',
        errors: [
          {
            message: 'Email is required',
            path: ['user', 'email'],
            code: 'invalid_type',
          },
          {
            message: 'Password must be at least 8 characters',
            path: ['user', 'password'],
            code: 'too_small',
          },
        ],
      };

      const validationError = fromZodError(zodError, 'Validation failed');

      expect(validationError).toBeInstanceOf(ValidationError);
      expect(validationError.message).toBe('Validation failed');
      expect(validationError.status).toBe(422);
      expect(validationError.details).toHaveLength(2);
      expect(validationError.details[0]).toEqual({
        path: 'user.email',
        message: 'Email is required',
      });
      expect(validationError.details[1]).toEqual({
        path: 'user.password',
        message: 'Password must be at least 8 characters',
      });
    });

    it('should handle empty errors array', () => {
      const zodError = {
        name: 'ZodError',
        errors: [],
      };

      const validationError = fromZodError(zodError, 'Validation failed');

      expect(validationError).toBeInstanceOf(ValidationError);
      expect(validationError.details).toHaveLength(0);
    });

    it('should handle errors with empty path array', () => {
      const zodError = {
        name: 'ZodError',
        errors: [
          {
            message: 'Invalid input',
            path: [],
            code: 'invalid_type',
          },
        ],
      };

      const validationError = fromZodError(zodError, 'Validation failed');

      expect(validationError).toBeInstanceOf(ValidationError);
      expect(validationError.details[0].path).toBe('');
    });
  });
});
