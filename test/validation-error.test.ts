import { ValidationError } from '@/errors/validation-error';
import { CustomError } from '@/errors/custom-error';

describe('ValidationError', () => {
  it('should create a validation error with default values', () => {
    const error = new ValidationError('Validation failed');

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('Validation failed');
    expect(error.status).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.errors).toEqual([]);
  });

  it('should create a validation error with custom errors', () => {
    const validationErrors = [
      { field: 'email', message: 'Email is required' },
      { field: 'password', message: 'Password must be at least 8 characters' },
    ];

    const error = new ValidationError('Validation failed', validationErrors);

    expect(error.message).toBe('Validation failed');
    expect(error.errors).toEqual(validationErrors);
  });
});
