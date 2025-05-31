import { CustomError } from '@/errors/custom-error';

describe('CustomError', () => {
  it('should create a custom error with default values', () => {
    const error = new CustomError('Test error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe('Test error');
    expect(error.status).toBe(500);
    expect(error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(error.isOperational).toBe(true);
    expect(error.stack).toBeDefined();
  });

  it('should create a custom error with custom values', () => {
    const error = new CustomError('Custom error', {
      status: 403,
      code: 'FORBIDDEN',
      isOperational: false,
    });

    expect(error.message).toBe('Custom error');
    expect(error.status).toBe(403);
    expect(error.code).toBe('FORBIDDEN');
    expect(error.isOperational).toBe(false);
  });
});
