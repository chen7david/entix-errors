import { NotFoundError } from '@/errors/not-found-error';
import { CustomError } from '@/errors/custom-error';

describe('NotFoundError', () => {
  it('should create a not found error with default values', () => {
    const error = new NotFoundError();

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toBe('Resource not found');
    expect(error.status).toBe(404);
    expect(error.code).toBe('RESOURCE_NOT_FOUND');
  });

  it('should create a not found error with custom message and resource', () => {
    const error = new NotFoundError('User not found', 'user');

    expect(error.message).toBe('User not found');
    expect(error.status).toBe(404);
    expect(error.code).toBe('USER_NOT_FOUND');
  });
});
